import difflib
import functools
import itertools
import math
import random
import threading

import structlog

from .game_state import Lobby, Player, TaggedMessage
from .models import (
    Burger,
    Chat,
    Drink,
    Fry,
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
        self.day = 0

        self.order: Order

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
                        score = self.grade_order(order)
                        self.lobby.broadcast(Message(data=OrderScore(score=score)))
                    case _:
                        logger.warning("Unimplemented message.", message=message.data)

    def start_game(self, id: str) -> None:
        """
        Start game and generate the first order.

        Args:
            id: The id of the player that started the game.
        """
        logger.debug("Starting game.")

        self.assign_roles()
        self.day = 1
        self.order = self.generate_order()
        self.manager.send(Message(data=NewOrder(order=self.order)))

        self.lobby.broadcast(Message(data=GameStart()), exclude=[id])

    def assign_roles(self) -> None:
        """Assign roles to players."""
        roles = list(Role)[: len(self.lobby.players)]
        random.shuffle(roles)

        for player, role in zip(self.lobby.players.values(), roles, strict=False):
            player.role = role

            player.send(Message(data=RoleAssignment(role=role)))

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

    def grade_order(self, order: Order) -> float:
        """
        Grade order based on correctness.

        See capstone-projects-2025-spring.github.io/aac-go-fish/docs/requirements/features-and-requirements#scoring
        """
        # Burgers are graded based on edit distance to the correct burger for up to 2 extra dollars + 3 base dollars
        burger_score = 3
        if order.burger is not None:
            # this is never None, but the type checker doesn't know that
            assert self.order.burger is not None

            similarity = difflib.SequenceMatcher(None, order.burger.ingredients, self.order.burger.ingredients).ratio()
            burger_score += 2 * similarity

        # Sides are graded based on completeness.
        # Up to 2 extra dollars + 1 base dollar
        side_score = 0
        if self.order.fry is not None:
            side_score += 1

            if self.order.fry == order.fry:
                side_score += 2

        # Drink attributes are equally weighted, with the fill percentage being
        # graded on the square root of the error from the correct fill
        # percentage. up to 2 bonus dollars + 2 base dollars
        drink_score = 0
        if not (self.order.drink is None or order.drink is None):
            drink_score += 2

            score_per_attribute = 1 / 4 * 2
            correct = (
                (self.order.drink.size == order.drink.size)
                + (self.order.drink.ice == order.drink.ice)
                + (self.order.drink.color == order.drink.color)
            )
            drink_score += score_per_attribute * correct
            drink_score += math.sqrt(1 - abs(1 - order.drink.fill / 100)) * score_per_attribute

        return round(burger_score + side_score + drink_score, 2)

    def typing_indicator(self, msg: TaggedMessage) -> None:
        """Send an indicator that the manager is typing."""
        self.lobby.broadcast(Message(data=msg.data), exclude=[msg.id])

    @functools.cached_property
    def manager(self) -> Player:
        """The player with the manager role."""
        return next(player for player in self.lobby.players.values() if player.role == Role.manager)


def start_main_loop(lobby: Lobby) -> None:
    """Start the main game loop."""
    loop = GameLoop(lobby)
    threading.Thread(target=loop.run).start()
