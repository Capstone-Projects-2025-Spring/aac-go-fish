import asyncio
from typing import Callable
from backend.game_state import Lobby

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

        return ""

    def register_lobby(self) -> str:
        """
        Create a new lobby.

        Returns:
            The lobby's join code.
        """
        code = self.code_generator()
        l = Lobby({}, asyncio.Queue(), code)

        self.lobbies[code] = l
        return code


LobbyManager = _LobbyManager(lambda: "code")
