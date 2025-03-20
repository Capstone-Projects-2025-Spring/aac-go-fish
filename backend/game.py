import functools
import logging
import threading

from .game_state import Lobby, Player
from .models import Chat, GameStart, Message, NewOrder, Role

logger = logging.getLogger(__file__)


class GameLoop:
    """Implements game logic."""

    def __init__(self, lobby: Lobby) -> None:
        self.lobby = lobby
        self.day = 0

    def run(self) -> None:
        """
        Main game loop.

        Processes messages in a loop.
        """
        while True:
            # avoid an infinite loop if we process messages slower than they come in
            messages = list(self.lobby.messages())
            for message in messages:
                match message.data:
                    case GameStart():
                        self.start_game()
                    case Chat() as c:
                        self.typing_indicator(c)
                    case _:
                        logger.warning("Unrecognized message: %.", message.data)

    def start_game(self) -> None:
        """Start game and generate the first order."""
        logger.debug("Starting game.")

        self.day = 1
        self.manager.send(Message(data=NewOrder()))

    def typing_indicator(self, msg: Chat) -> None:
        """Send an indicator that the manager is typing."""
        self.lobby.broadcast(Message(data=msg), exclude=[msg.id])

    @functools.cached_property
    def manager(self) -> Player:
        """The player with the manager role."""
        return next(player for player in self.lobby.players.values() if player.role == Role.manager)


def start_main_loop(lobby: Lobby) -> None:
    """Start the main game loop."""
    loop = GameLoop(lobby)
    threading.Thread(target=loop.run).start()
