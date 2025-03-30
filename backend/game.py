import functools
import random
import threading

import structlog

from .game_state import Lobby, Player
from .models import Burger, Chat, Drink, Fry, GameStart, Message, NewOrder, Order, Role

logger = structlog.stdlib.get_logger(__file__)

BURGER_INGREDIENTS = ["patty", "lettuce", "onion", "tomato", "ketchup", "mustard", "cheese"]
DRINK_COLORS = ["blue", "red", "yellow", "orange", "purple", "green"]
DRINK_SIZES = ["S", "M", "L"]


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
                        logger.warning("Unimplemented message.", message=message.data)

    def start_game(self) -> None:
        """Start game and generate the first order."""
        logger.debug("Starting game.")

        self.day = 1
        self.manager.send(Message(data=NewOrder(order=self.generate_order())))

    def generate_order(self) -> Order:
        """Generate an order based on the number of players."""
        order = Order(
            burger=Burger(
                ingredients=["bottom bun"] + random.choices(BURGER_INGREDIENTS, k=random.randint(3, 8)) + ["top bun"]
            ),
            drink=None,
            fry=None,
        )

        if len(self.lobby.players) >= 3:
            order.drink = Drink(color=random.choice(DRINK_COLORS), fill=0, ice=True, size=random.choice(DRINK_SIZES))

        if len(self.lobby.players) >= 4:
            order.fry = Fry()

        return order

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
