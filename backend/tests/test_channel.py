from backend.channel import channel
from backend.models import Role
from backend.game_state import Lobby, Player


def test_put_left_get_right() -> None:
    """Put into left, get from right."""
    left, right = channel()

    left.put(3)

    out = right.get()

    assert out == 3


def test_put_right_get_left() -> None:
    """Put into right, get from left."""
    left, right = channel()

    left.put(3)

    out = right.get()

    assert out == 3


def test_lobby_broadcast() -> None:
    """Broadcasted messages are received from multiple players."""
    left_a, right_a = channel()
    left_b, right_b = channel()

    lobby = Lobby({"A": Player(left_a, Role.manager), "B": Player(left_b, Role.burger)})

    msg = 5
    lobby.broadcast(msg)  # pyright: ignore[reportArgumentType]

    assert right_a.get() == msg
    assert right_b.get() == msg
