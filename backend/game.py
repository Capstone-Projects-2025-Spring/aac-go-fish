import functools
import itertools
import random
import threading

import structlog

from .game_state import Lobby, Player
from .models import Burger, Chat, Drink, Fry, GameEnd, GameStart, Message, NewOrder, Order, OrderComponent, Role

logger = structlog.stdlib.get_logger(__file__)

BURGER_INGREDIENTS = ["Patty", "Lettuce", "Onion", "Tomato", "Ketchup", "Mustard", "Cheese"]
DRINK_COLORS = ["Blue", "Red", "Yellow", "Orange", "Purple", "Green"]
DRINK_SIZES = ["S", "M", "L"]

MESSAGES_PER_LOOP = 5


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
            for message in itertools.islice(self.lobby.messages(), MESSAGES_PER_LOOP):
                match message.data:
                    case GameStart():
                        self.start_game()
                    case GameEnd():
                        return
                    case Chat() as c:
                        self.typing_indicator(c)
                    case OrderComponent() as component:
                        self.manager.send(Message(data=component))
                    case _:
                        logger.warning("Unimplemented message.", message=message.data)

    def start_game(self) -> None:
        """Start game and generate the first order."""
        logger.debug("Starting game.")

        self.assign_roles()
        self.day = 1
        self.manager.send(Message(data=NewOrder(order=self.generate_order())))

    def assign_roles(self) -> None:
        """Assign roles to players."""
        roles = list(Role)[: len(self.lobby.players)]
        random.shuffle(roles)

        for player, role in zip(self.lobby.players.values(), roles, strict=False):
            player.role = role

    def generate_order(self) -> Order:
        """Generate an order based on the number of players."""
        order = Order(
            burger=Burger(
                ingredients=["Bottom Bun"] + random.choices(BURGER_INGREDIENTS, k=random.randint(3, 8)) + ["Top Bun"]
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
