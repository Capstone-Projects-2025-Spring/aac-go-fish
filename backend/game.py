import threading

from .game_state import Lobby
from .models import Chat, Message, Role


class GameLoop:
    """Implements game logic."""

    def __init__(self, lobby: Lobby) -> None:
        self.lobby = lobby

    def run(self) -> None:
        """
        Main game loop.

        Processes messages in a loop.
        """
        messages = iter(self.lobby.messages())
        while True:
            message = next(messages)

            match message.data:
                case Chat() as c:
                    self.typing_indicator(c)

    def typing_indicator(self, msg: Chat) -> None:
        """Send an indicator that the manager is typing."""
        for player in self.lobby.players.values():
            if player.role == Role.manager:
                continue
            player.send(Message(data=msg))


def start_main_loop(lobby: Lobby) -> None:
    """Start the main game loop."""
    loop = GameLoop(lobby)
    threading.Thread(target=loop.run).start()
