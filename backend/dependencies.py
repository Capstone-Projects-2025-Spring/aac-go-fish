import asyncio
import contextlib
import queue
from collections.abc import Callable
from functools import cache

from .constants import Settings
from .game import start_main_loop
from .game_state import Lobby, Player


class Channel[T]:
    """Wrapper class around two queues for two-way communication."""

    def __init__(self, send: queue.Queue[T], recv: queue.Queue[T]) -> None:
        self._send = send
        self._recv = recv

    def send(self, msg: T) -> None:
        """Send a message."""
        # Can't raise queue.Full because we don't set a max size.
        self._send.put_nowait(msg)

    def recv_nowait(self) -> T | None:
        """Receive a message or None if empty."""
        return self._recv.get()

    def recv(self) -> T:
        """Receive a message. Blocks until a message is available."""
        return self._recv.get()

    async def arecv(self) -> T:
        """Receive a message."""
        while True:
            with contextlib.suppress(queue.Empty):
                return self._recv.get_nowait()

            await asyncio.sleep(0.05)


class LobbyManager:
    """Handle creation of lobbies and adding players to lobbies."""

    def __init__(self, code_generator: Callable[[], str]) -> None:
        self.lobbies: dict[str, Lobby] = {}
        self.code_generator = code_generator

    def register_player(self, code: str) -> str:
        """
        Add a player to a lobby given a lobby join code.

        Role is assigned based on order of joining. The first player has the
        manager role, the second has the burger role, the third has the fry
        role, the fourth has the drink role.

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

        # role assigned later when game starts
        player = Player(channel=channel, role=None)

        lobby.players[player.id] = player

        return player.id

    def register_lobby(self) -> str:
        """
        Create a new lobby in its own thread.

        Returns:
            The lobby's join code
        """
        code = self.code_generator()
        lobby = Lobby(code)

        self.lobbies[code] = lobby

        return code

    def channel(self, code: str, id: str) -> Channel:
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


_LobbyManager = LobbyManager(lambda: "code")


def lobby_manager() -> LobbyManager:
    """Return the lobby manager dependency."""
    return _LobbyManager


@cache
def settings() -> Settings:
    """Return the app settings."""
    return Settings()
