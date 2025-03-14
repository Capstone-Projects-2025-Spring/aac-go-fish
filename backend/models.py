from enum import StrEnum
from typing import Annotated, Literal
from uuid import uuid4

from pydantic import BaseModel, Field, TypeAdapter


class Lobby(BaseModel):
    """
    A class representing a game state.

    Attributes:
        id (int): The lobby's internal ID
        code (str): The code used to join the lobby
        players (dict): A list of player objects participating in the game
        started (bool): Whether the game has started
    """

    id: int
    code: str = "ABC"
    players: dict = dict()
    started: bool = False


class Player(BaseModel):
    """
    A class representing a player's ingame data.

    Attributes:
        id (int): The player's internal ID
        code (str): The code used to join the game
        socket (): TODO: A web socket object (this is probably its own class idk yet)
    """

    id: str = Field(default_factory=lambda: uuid4().hex)
    name: str = "Unnamed Player"
    socket: None = None


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


class Chat(BaseModel):
    """Represents a chat message sent between players."""

    type: Literal[MessageKind.chat]

    id: str
    typing: bool


Message = TypeAdapter(Annotated[PlayerJoin, Field(discriminator="type")])
