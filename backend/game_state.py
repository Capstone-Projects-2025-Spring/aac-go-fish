from __future__ import annotations

import dataclasses
import itertools
from collections.abc import Iterable
from dataclasses import dataclass
from uuid import uuid4

from .channel import Channel
from .models import Message, Role


@dataclass
class Lobby:
    """
    A class representing a game state.

    Attributes:
        id (str): The lobby's internal ID
        players (dict[str, Player]): Map of player id to Players.
        code (str): The code used to join the lobby
        started (bool): Whether the game has started
    """

    players: dict[str, Player]
    id: str = dataclasses.field(init=False, default_factory=lambda: uuid4().hex)
    code: str = "ABC"
    started: bool = False

    async def broadcast(self, msg: Message) -> None:
        """Send a message to all players."""
        for player in self.players.values():
            await player.send(msg)

    async def messages(self) -> Iterable[Message]:
        """Consume messages from all players."""

        return []


@dataclass
class Player:
    """
    A class representing a player's ingame data.

    Attributes:
        id (str): The player's internal ID
        role (Role): The player's role.
        channel (Channel): Channel to send messages to frontend.
    """

    channel: Channel
    role: Role
    id: str = dataclasses.field(init=False, default_factory=lambda: uuid4().hex)

    async def send(self, msg: Message) -> None:
        """Send a message to this player."""
        await self.channel.put(msg)
