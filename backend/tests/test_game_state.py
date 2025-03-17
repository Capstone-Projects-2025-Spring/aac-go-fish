import asyncio

import pytest

from backend.game_state import Lobby, Player
from backend.models import Role

type LobbyFixture = tuple[Lobby, asyncio.Queue[int], asyncio.Queue[int], asyncio.Queue[int]]


@pytest.fixture
def lobby() -> LobbyFixture:
    """Setup a Lobby with channels for 2 players."""
    lobby_q = asyncio.Queue()
    a_q = asyncio.Queue()
    b_q = asyncio.Queue()

    lobby = Lobby({"A": Player(a_q, Role.manager), "B": Player(b_q, Role.burger)}, lobby_q)

    return lobby, lobby_q, a_q, b_q


@pytest.mark.asyncio
async def test_lobby_broadcast(lobby: LobbyFixture) -> None:
    """Broadcasted messages are received from multiple players."""
    lobb, _, a_q, b_q = lobby

    await lobb.broadcast(3)  # pyright: ignore[reportArgumentType]

    assert await a_q.get() == 3
    assert await b_q.get() == 3


@pytest.mark.asyncio
async def test_messages_receives_msg(lobby: LobbyFixture) -> None:
    """Test iterator over multiple players."""
    lobb, lobby_q, _, _ = lobby

    await lobby_q.put(3)
    await lobby_q.put(6)

    i = aiter(lobb.messages())

    assert await anext(i) == 3
    assert await anext(i) == 6
