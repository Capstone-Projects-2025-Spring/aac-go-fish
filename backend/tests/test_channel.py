import pytest
from backend.channel import channel


@pytest.mark.asyncio
async def test_put_left_get_right() -> None:
    """Put into left, get from right."""
    left, right = channel()

    await left.put(3)

    out = await right.get()

    assert out == 3


@pytest.mark.asyncio
async def test_put_right_get_left() -> None:
    """Put into right, get from left."""
    left, right = channel()

    await left.put(3)

    out = await right.get()

    assert out == 3
