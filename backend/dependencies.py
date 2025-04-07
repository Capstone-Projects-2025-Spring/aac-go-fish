import asyncio
import contextlib
import itertools
import queue
import random
from functools import cache

from .constants import Settings
from .game import BURGER_INGREDIENTS, start_main_loop
from .game_state import Lobby, Player, TaggedMessage
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

    def __init__(self) -> None:
        self.lobbies: dict[tuple[str, ...], Lobby] = {}
        all_codes = list(itertools.product(BURGER_INGREDIENTS, repeat=settings().code_length))
        random.shuffle(all_codes)
        self.available_codes = all_codes

    def register_player(self, code: tuple[str, ...]) -> str:
        """
        Add a player to a lobby given a lobby join code.

        Creates a channel for the player to send and receive messages.
        Creates a new player object.
        Adds the player to the lobby if it is a valid code.
        Broadcasts the new player count to all players currently in the lobby.


        Args:
            code: The lobby join code.

        Raises:
            ValueError: The code is invalid.

        Returns:
            The id of the newly created player.
        """
        try:
            lobby = self.lobbies[code]
        except KeyError:
            raise ValueError(f"Code {code} is not associated with any existing lobbies!")

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

        if not lobby.started:
            lobby.started = True
            start_main_loop(lobby)

        channel = Channel(lobby.channel, lobby.players[id].channel)
        return channel


# Initialize the lobby manager without a code generator function
_LobbyManager = LobbyManager()


def lobby_manager() -> LobbyManager:
    """Return the lobby manager dependency."""
    return _LobbyManager
