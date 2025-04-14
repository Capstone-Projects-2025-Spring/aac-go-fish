from __future__ import annotations

import dataclasses
import queue
from collections.abc import Iterable
from dataclasses import dataclass
from uuid import uuid4

from .models import Chat, GameStateUpdate, Initializer, LifecycleEvent, Message, Role


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

    code: tuple[str, ...]
    players: dict[str, Player] = dataclasses.field(default_factory=dict)
    channel: queue.Queue[TaggedMessage] = dataclasses.field(default_factory=queue.Queue)
    id: str = dataclasses.field(init=False, default_factory=lambda: uuid4().hex)
    started: bool = False

    def broadcast(self, msg: Message, *, exclude: Iterable[str] = ()) -> None:
        """Send a message to all players except those in exclude."""
        exclude = set(exclude)
        for player in self.players.values():
            if player.id not in exclude:
                player.send(msg)

    def messages(self) -> Iterable[TaggedMessage]:
        """Iterate over messages that are currently available."""
        while True:
            try:
                yield self.channel.get_nowait()
            except queue.Empty:
                return


@dataclass
class Player:
    """
    A player in a lobby.

    Attributes:
        id: The player's internal ID
        role: The player's role. None if the game has not started yet.
        channel: Message queue for outgoing messages.
    """

    channel: queue.Queue
    role: Role | None
    id: str = dataclasses.field(init=False, default_factory=lambda: uuid4().hex)

    def send(self, msg: Message) -> None:
        """Send a message to this player."""
        self.channel.put(msg)


@dataclass(frozen=True)
class TaggedMessage:
    """A message with extra metadata attached."""

    data: Initializer | GameStateUpdate | LifecycleEvent | Chat
    id: str


class LobbyNotFoundError(ValueError):
    """The lobby does not exist."""


class LobbyFullError(ValueError):
    """The lobby is full."""
