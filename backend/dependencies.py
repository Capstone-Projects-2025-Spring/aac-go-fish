import asyncio

Q = asyncio.Queue(maxsize=10000)


def event_queue() -> asyncio.Queue:
    """Returns the event queue."""
    return Q
