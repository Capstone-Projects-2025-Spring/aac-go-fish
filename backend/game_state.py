from __future__ import annotations

import asyncio
import dataclasses
from collections.abc import AsyncIterable
from dataclasses import dataclass
from uuid import uuid4

from .models import Message, Role


@dataclass
class Lobby:
    """
    Maintains lobby state and allows communication to and from players.

    Attributes:
        id: The lobby's internal ID
        players: Map of player id to Players.
        channel: Message queue for incoming messages.
        code: The code used to join the lobby
        started: Whether the game has started
    """

    players: dict[str, Player]
    channel: asyncio.Queue
    id: str = dataclasses.field(init=False, default_factory=lambda: uuid4().hex)
    code: str = "ABC"
    started: bool = False

    async def broadcast(self, msg: Message) -> None:
        """Send a message to all players."""
        for player in self.players.values():
            await player.send(msg)

    async def messages(self) -> AsyncIterable[Message]:
        """Consume messages from all players."""
        while True:
            yield await self.channel.get()


@dataclass
class Player:
    """
    A player in a lobby.

    Attributes:
        id: The player's internal ID
        role: The player's role.
        channel: Message queue for outgoing messages.
    """

    channel: asyncio.Queue
    role: Role
    id: str = dataclasses.field(init=False, default_factory=lambda: uuid4().hex)

    async def send(self, msg: Message) -> None:
        """Send a message to this player."""
        await self.channel.put(msg)
