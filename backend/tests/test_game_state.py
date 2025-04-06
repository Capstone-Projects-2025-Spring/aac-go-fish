import queue

import pytest

from backend.game_state import Lobby, Player
from backend.models import Role

type LobbyFixture = tuple[Lobby, queue.Queue[int], queue.Queue[int], queue.Queue[int]]


@pytest.fixture
def lobby() -> LobbyFixture:
    """Setup a Lobby with channels for 2 players."""
    lobby_q = queue.Queue()
    a_q = queue.Queue()
    b_q = queue.Queue()

    lobby = Lobby(
        code=("Lettuce", "Tomato", "Onion"),
        players={"A": Player(a_q, Role.manager), "B": Player(b_q, Role.burger)},
        channel=lobby_q,
    )

    return lobby, lobby_q, a_q, b_q


def test_lobby_broadcast(lobby: LobbyFixture) -> None:
    """Broadcasted messages are received by multiple players."""
    lobb, _, a_q, b_q = lobby

    lobb.broadcast(3)  # pyright: ignore[reportArgumentType]

    assert a_q.get() == 3
    assert b_q.get() == 3


def test_lobby_broadcast_exclude(lobby: LobbyFixture) -> None:
    """Broadcasted messages are received by players that are not excluded."""
    lobb, _, a_q, b_q = lobby

    # pick player A to exclude :(
    exclude = lobb.players["A"].id
    lobb.broadcast(3, exclude=[exclude])  # pyright: ignore[reportArgumentType]

    assert b_q.get() == 3

    with pytest.raises(queue.Empty):
        # should be empty
        a_q.get(block=False)


def test_messages_receives_msg(lobby: LobbyFixture) -> None:
    """Test iterator over multiple players."""
    lobb, lobby_q, _, _ = lobby

    lobby_q.put(3)
    lobby_q.put(6)

    i = iter(lobb.messages())

    assert next(i) == 3
    assert next(i) == 6
