from backend.channel import channel

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
