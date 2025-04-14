import asyncio
import contextlib
import itertools
import queue
import random
from collections.abc import AsyncGenerator, Iterable
from functools import cache

from fastapi import WebSocket, WebSocketDisconnect

from .constants import Settings
from .game import BURGER_INGREDIENTS, start_main_loop
from .game_state import Lobby, LobbyClosedError, LobbyFullError, LobbyNotFoundError, Player, TaggedMessage
from .models import Message, PlayerCount


class Channel[S, R]:
    """Wrapper class around two queues for two-way communication."""

    def __init__(self, send: queue.Queue[S], recv: queue.Queue[R]) -> None:
        self._send = send
        self._recv = recv

    def send(self, msg: S) -> None:
        """Send a message."""
        # Can't raise queue.Full because we don't set a max size.
        self._send.put_nowait(msg)

    def recv_nowait(self) -> R | None:
        """Receive a message or None if empty."""
        return self._recv.get()

    def recv(self) -> R:
        """Receive a message. Blocks until a message is available."""
        return self._recv.get()

    async def arecv(self) -> R:
        """Receive a message."""
        while True:
            with contextlib.suppress(queue.Empty):
                return self._recv.get_nowait()

            await asyncio.sleep(0.05)


@cache
def settings() -> Settings:
    """Return the app settings."""
    return Settings()


class LobbyManager:
    """Handle creation of lobbies and adding players to lobbies."""

    def __init__(self, codes: Iterable[str]) -> None:
        self.lobbies: dict[tuple[str, ...], Lobby] = {}
        all_codes = list(itertools.product(codes, repeat=settings().code_length))
        random.shuffle(all_codes)
        self.available_codes = all_codes

    def register_player(self, code: tuple[str, ...]) -> str:
        """
        Add a player to a lobby given a lobby join code.

        Args:
            code: The lobby join code.

        Raises:
            LobbyNotFound: The lobby does not exist.
            LobbyFull: The lobby is full.
            LobbyClosedError: The game has already started.

        Returns:
            The id of the newly created player.
        """
        try:
            lobby = self.lobbies[code]
        except KeyError:
            raise LobbyNotFoundError(f"Code {code} is not associated with any existing lobbies!")

        if len(lobby.players) == 4:
            raise LobbyFullError("Lobby is full.")

        if not lobby.open:
            raise LobbyClosedError("Lobby has already started.")

        channel = queue.Queue()
        player = Player(channel=channel, role=None)
        lobby.players[player.id] = player
        lobby.broadcast(Message(data=PlayerCount(count=len(lobby.players), player_ids=list(lobby.players.keys()))))

        return player.id

    def register_lobby(self) -> tuple[str, ...]:
        """
        Create a new lobby in its own thread.

        Returns:
            The lobby's join code

        Raises:
            RuntimeError: If no more codes are available
        """
        if not self.available_codes:
            raise RuntimeError("No more lobby codes available, server is full")

        code = self.available_codes.pop()
        lobby = Lobby(code)

        self.lobbies[code] = lobby

        return code

    def delete_lobby(self, code: tuple[str, ...]) -> None:
        """
        Delete a lobby and recycle its code.

        Args:
            code: The lobby join code.
        """
        if code in self.lobbies:
            del self.lobbies[code]
            self.available_codes.append(code)

    def channel(self, code: tuple[str, ...], id: str) -> Channel[TaggedMessage, Message]:
        """
        Create a channel for sending and receiving messages to and from the lobby.

        Args:
            code: Lobby join code.
            id: Player id.
        """
        lobby = self.lobbies[code]

        if not lobby.loop_started:
            lobby.loop_started = True
            start_main_loop(lobby)

        channel = Channel(lobby.channel, lobby.players[id].channel)
        return channel


_LobbyManager = LobbyManager(BURGER_INGREDIENTS)


def lobby_manager() -> LobbyManager:
    """Return the lobby manager dependency."""
    return _LobbyManager


@contextlib.asynccontextmanager
async def connection_manager(websocket: WebSocket) -> AsyncGenerator[WebSocket, None]:
    """Handle websocket connect/disconnect."""
    await websocket.accept()

    try:
        yield websocket
    except WebSocketDisconnect:
        pass
    except Exception:
        await websocket.close()
