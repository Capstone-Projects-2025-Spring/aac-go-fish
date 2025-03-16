import pytest

from backend.channel import channel
from backend.game_state import Lobby, Player
from backend.models import Role


@pytest.mark.asyncio
async def test_lobby_broadcast() -> None:
    """Broadcasted messages are received from multiple players."""
    left_a, right_a = channel()
    left_b, right_b = channel()

    lobby = Lobby({"A": Player(left_a, Role.manager), "B": Player(left_b, Role.burger)})

    msg = 5
    await lobby.broadcast(msg)  # pyright: ignore[reportArgumentType]

    assert right_a.get() == msg
    assert right_b.get() == msg


@pytest.mark.asyncio
async def test_messages_receives_msg() -> None:
    """Test iterator over multiple players."""
    left_a, right_a = channel()
    left_b, right_b = channel()

    lobby = Lobby({"A": Player(left_a, Role.manager), "B": Player(left_b, Role.burger)})

    await right_a.put(4)
    await right_b.put(8)

    messages = iter(await lobby.messages())
    assert next(messages) == 4
    assert next(messages) == 8


@pytest.mark.asyncio
async def test_messages_skips_none() -> None:
    """Test that the iterator skips over empty player message channels."""
    left_a, right_a = channel()
    left_b, _ = channel()

    lobby = Lobby({"A": Player(left_a, Role.manager), "B": Player(left_b, Role.burger)})

    # two messages from A: we should get both without any Nones in between
    await right_a.put(4)
    await right_a.put(8)

    messages = iter(await lobby.messages())
    assert next(messages) == 4
    assert next(messages) == 8
