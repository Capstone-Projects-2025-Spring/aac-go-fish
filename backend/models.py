from __future__ import annotations

from enum import StrEnum, auto
from typing import Annotated, Literal

from pydantic import BaseModel, Field


class Role(StrEnum):
    """Player roles."""

    manager = auto()
    burger = auto()
    fry = auto()
    drink = auto()


class MessageKind(StrEnum):
    """Message kinds."""

    initializer = "initializer"
    game_state = "game_state"
    lobby_lifecycle = "lobby_lifecycle"
    chat = "chat"


class Initializer(BaseModel):
    """
    Initializes player state.

    Links the websocket connection to a specific player and lobby.

    Attributes:
        code: Lobby join code.
        id: Player id.
    """

    type: Literal[MessageKind.initializer] = MessageKind.initializer

    code: str
    id: str


class GameStateUpdateKind(StrEnum):
    """Game state update kinds."""

    new_order = "new_order"
    role_assignment = "role_assignment"
    order_score = "order_score"
    order_submission = "order_submission"
    order_component = "order_component"
    day_end = "day_end"


class NewOrder(BaseModel):
    """A new order for the manager."""

    type: Literal[MessageKind.game_state] = MessageKind.game_state
    game_state_update_type: Literal[GameStateUpdateKind.new_order] = GameStateUpdateKind.new_order

    order: Order


class RoleAssignment(BaseModel):
    """Assign a role to the player."""

    type: Literal[MessageKind.game_state] = MessageKind.game_state
    game_state_update_type: Literal[GameStateUpdateKind.role_assignment] = GameStateUpdateKind.role_assignment

    id: str
    role: Role


class OrderScore(BaseModel):
    """A score for the order."""

    type: Literal[MessageKind.game_state] = MessageKind.game_state
    game_state_update_type: Literal[GameStateUpdateKind.order_score] = GameStateUpdateKind.order_score

    score: float


class OrderComponent(BaseModel):
    """A finished component is submitted to the manager."""

    type: Literal[MessageKind.game_state] = MessageKind.game_state
    game_state_update_type: Literal[GameStateUpdateKind.order_component] = GameStateUpdateKind.order_component

    component: Burger | Fry | Drink


class OrderSubmission(BaseModel):
    """An order is submitted for review."""

    type: Literal[MessageKind.game_state] = MessageKind.game_state
    game_state_update_type: Literal[GameStateUpdateKind.order_submission] = GameStateUpdateKind.order_submission

    order: Order


class Order(BaseModel):
    """A complete order."""

    burger: Burger | None
    drink: Drink | None
    fry: Fry | None


class Burger(BaseModel):
    """A burger."""

    ingredients: list[str]


class Drink(BaseModel):
    """A drink."""

    color: str
    fill: float
    ice: bool
    size: str


class Fry(BaseModel):
    """A fries."""


class DayEnd(BaseModel):
    """No more orders for this day."""

    type: Literal[MessageKind.game_state] = MessageKind.game_state
    game_state_update_type: Literal[GameStateUpdateKind.day_end] = GameStateUpdateKind.day_end


type GameStateUpdate = Annotated[
    NewOrder | RoleAssignment | OrderScore | OrderSubmission | OrderComponent | DayEnd,
    Field(discriminator="game_state_update_type"),
]


class LobbyLifecycleEventKind(StrEnum):
    """Lobby lifecycle event kinds."""

    player_join = "player_join"
    player_leave = "player_leave"
    game_start = "game_start"
    game_end = "game_end"


class PlayerJoin(BaseModel):
    """A player joining a lobby."""

    type: Literal[MessageKind.lobby_lifecycle] = MessageKind.lobby_lifecycle
    lifecycle_type: Literal[LobbyLifecycleEventKind.player_join] = LobbyLifecycleEventKind.player_join

    id: str


class PlayerLeave(BaseModel):
    """A player leaving a lobby."""

    type: Literal[MessageKind.lobby_lifecycle] = MessageKind.lobby_lifecycle
    lifecycle_type: Literal[LobbyLifecycleEventKind.player_leave] = LobbyLifecycleEventKind.player_leave

    id: str


class GameStart(BaseModel):
    """The host starts the game."""

    type: Literal[MessageKind.lobby_lifecycle] = MessageKind.lobby_lifecycle
    lifecycle_type: Literal[LobbyLifecycleEventKind.game_start] = LobbyLifecycleEventKind.game_start


class GameEnd(BaseModel):
    """All days are completed."""

    type: Literal[MessageKind.lobby_lifecycle] = MessageKind.lobby_lifecycle
    lifecycle_type: Literal[LobbyLifecycleEventKind.game_end] = LobbyLifecycleEventKind.game_end


type LifecycleEvent = Annotated[PlayerJoin | PlayerLeave | GameStart | GameEnd, Field(discriminator="lifecycle_type")]


class Chat(BaseModel):
    """The manager is typing."""

    type: Literal[MessageKind.chat] = MessageKind.chat

    id: str
    typing: bool


class Message(BaseModel):
    """Wrapper for message models."""

    data: Initializer | GameStateUpdate | LifecycleEvent | Chat = Field(discriminator="type")


if __name__ == "__main__":
    import json

    message_schema = Message.model_json_schema()
    print(json.dumps(message_schema, indent=2))  # noqa: T201
