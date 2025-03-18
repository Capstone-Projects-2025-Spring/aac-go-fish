from __future__ import annotations

import dataclasses
import queue
from collections.abc import Iterable
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

    code: str = "ABC"
    players: dict[str, Player] = dataclasses.field(default_factory=dict)
    channel: queue.Queue = dataclasses.field(default_factory=queue.Queue)
    id: str = dataclasses.field(init=False, default_factory=lambda: uuid4().hex)
    started: bool = False

    def broadcast(self, msg: Message) -> None:
        """Send a message to all players."""
        for player in self.players.values():
            player.send(msg)

    def messages(self) -> Iterable[Message]:
        """Consume messages from all players."""
        while True:
            yield self.channel.get()


@dataclass
class Player:
    """
    A player in a lobby.

    Attributes:
        id: The player's internal ID
        role: The player's role.
        channel: Message queue for outgoing messages.
    """

    channel: queue.Queue
    role: Role
    id: str = dataclasses.field(init=False, default_factory=lambda: uuid4().hex)

    def send(self, msg: Message) -> None:
        """Send a message to this player."""
        self.channel.put(msg)
