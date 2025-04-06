import functools
import itertools
import random
import threading
from collections import deque

import structlog

from .game_state import Lobby, Player
from .models import (
    Burger,
    Chat,
    DayEnd,
    Drink,
    Fry,
    GameEnd,
    GameStart,
    Message,
    NewOrder,
    Order,
    OrderComponent,
    OrderSubmission,
    Role,
)

logger = structlog.stdlib.get_logger(__file__)

BURGER_INGREDIENTS = ["Patty", "Lettuce", "Onion", "Tomato", "Ketchup", "Mustard", "Cheese"]
DRINK_COLORS = ["Blue", "Red", "Yellow", "Orange", "Purple", "Green"]
DRINK_SIZES = ["S", "M", "L"]

MESSAGES_PER_LOOP = 5


class GameLoop:
    """Implements game logic."""

    def __init__(self, lobby: Lobby) -> None:
        self.lobby = lobby
        self.day = 1
        self.num_players = 4

        self.orders = get_orders(day=self.day, num_players=self.num_players)

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
                    case OrderSubmission():
                        self.handle_next_order()
                    case _:
                        logger.warning("Unimplemented message.", message=message.data)

    def start_game(self) -> None:
        """Start game and generate the first order."""
        logger.debug("Starting game.")

        self.assign_roles()
        self.handle_next_order()

    def assign_roles(self) -> None:
        """Assign roles to players."""
        roles = list(Role)[: len(self.lobby.players)]
        random.shuffle(roles)

        for player, role in zip(self.lobby.players.values(), roles, strict=False):
            player.role = role

    def handle_next_order(self) -> None:
        """Give manager next order."""
        if len(self.orders) == 0:
            self.handle_new_day()
            self.orders = get_orders(day=self.day, num_players=self.num_players)

        self.manager.send(Message(data=NewOrder(order=self.orders.pop())))
        logger.debug("Order sent.")

    def handle_new_day(self) -> None:
        """Executes game functions regarding updating day count."""
        self.day += 1
        logger.debug("New day.", day=self.day)
        self.lobby.broadcast(Message(data=DayEnd(day=self.day)))

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


def get_orders(day: int, num_players: int) -> deque[Order]:
    """Return a queue of orders for the next day."""
    orders = deque()
    for _ in range(_orders_on_day(day)):
        orders.append(_generate_order(num_players))
    return orders


def _orders_on_day(day: int) -> int:
    """Compute the number of orders on a given day."""
    return day * 2 - 1


def _generate_order(num_players: int) -> Order:
    """Generate an order based on the number of players."""
    order = Order(
        burger=Burger(
            ingredients=["Bottom Bun"] + random.choices(BURGER_INGREDIENTS, k=random.randint(3, 8)) + ["Top Bun"]
        ),
        drink=None,
        fry=None,
    )

    if num_players >= 3:
        order.fry = Fry()

    if num_players >= 4:
        order.drink = Drink(color=random.choice(DRINK_COLORS), fill=0, ice=True, size=random.choice(DRINK_SIZES))

    return order
