from __future__ import annotations

import dataclasses
from dataclasses import dataclass
from enum import Enum, StrEnum, auto
from typing import Annotated, Literal
from uuid import uuid4

from pydantic import BaseModel, Field

from .channel import Channel


class Role(Enum):
    """Player roles enum."""

    manager = auto()
    burger = auto()
    fry = auto()
    drink = auto()


@dataclass
class Lobby:
    """
    A class representing a game state.

    Attributes:
        id (int): The lobby's internal ID
        code (str): The code used to join the lobby
        players (dict): A list of player objects participating in the game
        started (bool): Whether the game has started
    """

    id: int
    players: dict[str, Player]
    code: str = "ABC"
    started: bool = False

    def broadcast(self, msg: Message) -> None:
        """Send a message to all players."""
        for player in self.players.values():
            player.send(msg)


@dataclass
class Player:
    """
    A class representing a player's ingame data.

    Attributes:
        id (int): The player's internal ID
        code (str): The code used to join the game
    """

    channel: Channel

    role: Role

    id: str = dataclasses.field(default_factory=lambda: uuid4().hex)

    def send(self, msg: Message) -> None:
        """Send a message to this player."""
        self.channel.put(msg)


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
