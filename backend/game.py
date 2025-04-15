import difflib
import itertools
import math
import random
import threading
from collections import deque

import structlog

from .game_state import Lobby, Player, TaggedMessage
from .models import (
    Burger,
    Chat,
    DayEnd,
    Drink,
    GameEnd,
    GameStart,
    Message,
    NewOrder,
    Order,
    OrderComponent,
    OrderScore,
    OrderSubmission,
    PlayerJoin,
    PlayerLeave,
    Role,
    RoleAssignment,
    Side,
)

logger = structlog.stdlib.get_logger(__file__)

BURGER_INGREDIENTS = ["Patty", "Lettuce", "Onion", "Tomato", "Ketchup", "Mustard", "Cheese"]
DRINK_COLORS = [
    ["Blue", "#34C6F4"],
    ["Green", "#99CA3C"],
    ["Yellow", "#F7EC13"],
    ["Red", "#FF0000"],
    ["Orange", "#F5841F"],
    ["Purple", "#7E69AF"],
]
DRINK_SIZES = ["small", "medium", "large"]
SIDE_TYPES = ["fries", "onionRings", "mozzarellaSticks"]

MESSAGES_PER_LOOP = 5


class GameLoop:
    """Implements game logic."""

    def __init__(self, lobby: Lobby) -> None:
        self.lobby = lobby

        # Backend stores game score and day
        # Acts as source of truth in case any messages fail to send
        self.day = 1
        self.score = 0

        self.orders = get_orders(day=self.day, num_players=len(self.lobby.players))
        self.order: Order

        self.started = False

    def run(self) -> None:
        """
        Main game loop.

        Processes messages in a loop.
        """
        while True:
            for message in itertools.islice(self.lobby.messages(), MESSAGES_PER_LOOP):
                match message.data:
                    case GameStart():
                        self.start_game(message.id)
                    case GameEnd():
                        return
                    case PlayerJoin():
                        self.lobby.broadcast(Message(data=message.data), exclude=[message.id])
                    case PlayerLeave(id=id):
                        self.lobby.players.pop(id)
                        self.lobby.broadcast(Message(data=message.data))
                    case Chat():
                        self.typing_indicator(message)
                    case OrderComponent() as component:
                        self.manager.send(Message(data=component))
                    case OrderSubmission(order=order):
                        logger.debug("Received order.", order=order)
                        self.score += self.grade_order(order)
                        self.lobby.broadcast(Message(data=OrderScore(score=self.score)))
                        self.handle_next_order()
                    case _:
                        logger.warning("Unimplemented message.", message=message.data)

    def start_game(self, id: str) -> None:
        """
        Start game and generate the first order.

        Args:
            id: The id of the player that started the game.
        """
        if self.started:
            return

        logger.debug("Starting game.")

        self.started = True
        self.lobby.open = False

        self.assign_roles()
        self.lobby.broadcast(Message(data=GameStart()), exclude=[id])
        self.handle_next_order()

    def assign_roles(self) -> None:
        """Assign roles to players."""
        roles = list(Role)[: len(self.lobby.players)]
        random.shuffle(roles)

        for player, role in zip(self.lobby.players.values(), roles, strict=False):
            player.role = role
            player.send(Message(data=RoleAssignment(role=role)))

    def handle_next_order(self) -> None:
        """Give manager next order."""
        if len(self.orders) == 0:
            self.handle_new_day()

        self.orders = get_orders(day=self.day, num_players=len(self.lobby.players))

        self.order = self.orders.pop()
        logger.debug("Order sent.")
        self.manager.send(Message(data=NewOrder(order=self.order)))

    def handle_new_day(self) -> None:
        """Update current day."""
        self.day += 1
        logger.debug("New day.", day=self.day)
        self.assign_roles()
        self.lobby.broadcast(Message(data=DayEnd(day=self.day)))

    def grade_order(self, order: Order) -> int:
        """
        Grade order based on correctness.

        See capstone-projects-2025-spring.github.io/aac-go-fish/docs/requirements/features-and-requirements#scoring
        """
        # Burgers are graded based on edit distance to the correct burger for up to 2 extra dollars + 3 base dollars
        burger_score = 300
        if order.burger is not None:
            # this is never None, but the type checker doesn't know that
            assert self.order.burger is not None

            similarity = difflib.SequenceMatcher(None, order.burger.ingredients, self.order.burger.ingredients).ratio()
            burger_score += int(200 * round(similarity, 2))

        # Sides are graded based on completeness.
        # Up to 2 extra dollars + 1 base dollar
        side_score = 0
        if self.order.side is not None:
            side_score += 100

            if self.order.side == order.side:
                side_score += 200

        # Drink attributes are equally weighted, with the fill percentage being
        # graded on the square root of the error from the correct fill
        # percentage. up to 2 bonus dollars + 2 base dollars
        drink_score = 0
        if not (self.order.drink is None or order.drink is None):
            drink_score += 200

            correct = (self.order.drink.size == order.drink.size) + (self.order.drink.color == order.drink.color)
            drink_score += 50 * correct

            drink_score += int(math.sqrt(1 - abs(1 - order.drink.fill / 100)) * 100)

        return burger_score + side_score + drink_score

    def typing_indicator(self, msg: TaggedMessage) -> None:
        """Send an indicator that the manager is typing."""
        self.lobby.broadcast(Message(data=msg.data), exclude=[msg.id])

    @property
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
        side=None,
    )

    if num_players >= 3:
        order.side = Side(table_state=random.choice(SIDE_TYPES))

    if num_players >= 4:
        order.drink = Drink(color=random.choice(DRINK_COLORS)[1], fill=100, size=random.choice(DRINK_SIZES))

    return order
