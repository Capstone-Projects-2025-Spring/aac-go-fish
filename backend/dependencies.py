import asyncio
from collections.abc import Callable

from backend.game_state import Lobby, Player
from backend.models import Role


class Channel[T]:
    """Wrapper class around two queues for two-way communication."""

    def __init__(self, send: asyncio.Queue[T], recv: asyncio.Queue[T]) -> None:
        self._send = send
        self._recv = recv

    def send(self, msg: T) -> None:
        """Send a message."""
        # Can't raise asyncio.QueueFull because we don't set a max size.
        self._send.put_nowait(msg)

    def recv(self) -> T | None:
        """Receive a message or None if empty."""
        try:
            return self._recv.get_nowait()
        except asyncio.QueueEmpty:
            return None


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

        channel = asyncio.Queue()
        role = list(Role)[len(lobby.players)]
        player = Player(channel, role)

        lobby.players[player.id] = player

        return player.id

    def register_lobby(self) -> tuple[str, str]:
        """
        Create a new lobby.

        Automatically registers the creator as a player in the lobby.

        Returns:
            A tuple of the lobby's join code and the first player's id.
        """
        code = self.code_generator()
        lobby = Lobby({}, asyncio.Queue(), code)

        self.lobbies[code] = lobby
        id = self.register_player(code)
        return code, id

    def channel(self, code: str, id: str) -> Channel:
        """
        Create a channel for sending and receiving messages to and from the lobby.

        Args:
            code: Lobby join code.
            id: Player id.
        """
        lobby = self.lobbies[code]
        channel = Channel(lobby.channel, lobby.players[id].channel)
        return channel


_LobbyManager = LobbyManager(lambda: "code")


def lobby_manager() -> LobbyManager:
    """Return the lobby manager dependency."""
    return _LobbyManager
