from __future__ import annotations

from enum import Enum, StrEnum, auto
from typing import Annotated, Literal

from pydantic import BaseModel, Field


class Role(Enum):
    """Player roles enum."""

    manager = auto()
    burger = auto()
    fry = auto()
    drink = auto()


class MessageKind(StrEnum):
    """Enum for different message kinds."""

    game_state = "game_state"
    lobby_lifecycle = "lobby_lifecycle"
    chat = "chat"


class GameState(BaseModel):
    """Message to update frontend game state."""

    type: Literal[MessageKind.game_state]
    state: dict


class LobbyLifecycleEventKind(StrEnum):
    """Enum for different lobby lifecycle event kinds."""

    player_join = "player_join"
    player_leave = "player_leave"
    game_start = "game_start"


class PlayerJoin(BaseModel):
    """Event for a player joining a lobby."""

    type: Literal[MessageKind.lobby_lifecycle]
    lifecycle_type: Literal[LobbyLifecycleEventKind.player_join]

    id: str


class PlayerLeave(BaseModel):
    """Event for a player leaving a lobby."""

    type: Literal[MessageKind.lobby_lifecycle]
    lifecycle_type: Literal[LobbyLifecycleEventKind.player_leave]

    id: str


class GameStart(BaseModel):
    """Event for the host starting the game."""

    type: Literal[MessageKind.lobby_lifecycle]
    lifecycle_type: Literal[LobbyLifecycleEventKind.game_start]


type LifecycleEvent = Annotated[PlayerJoin | PlayerLeave | GameStart, Field(discriminator="lifecycle_type")]


class Chat(BaseModel):
    """Represents a chat message sent between players."""

    type: Literal[MessageKind.chat]

    id: str
    typing: bool


class Message(BaseModel):
    """Wrapper for message models."""

    data: LifecycleEvent | Chat | GameState = Field(discriminator="type")


if __name__ == "__main__":
    import json

    message_schema = Message.model_json_schema()
    print(json.dumps(message_schema, indent=2))  # noqa: T201
