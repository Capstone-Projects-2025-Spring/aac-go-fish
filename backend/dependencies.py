import asyncio
from typing import Callable
from backend.game_state import Lobby, Player
from backend.models import Role

class _LobbyManager:
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

    def register_lobby(self) -> str:
        """
        Create a new lobby.

        Automatically registers this user as a player in the lobby.

        Returns:
            The lobby's join code.
        """
        code = self.code_generator()
        lobby = Lobby({}, asyncio.Queue(), code)

        self.lobbies[code] = lobby
        return code


LobbyManager = _LobbyManager(lambda: "code")
