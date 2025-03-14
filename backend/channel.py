from __future__ import annotations

import queue


def channel() -> tuple[Channel, Channel]:
    """Create a pair of channels."""
    lq = queue.Queue()
    rq = queue.Queue()

    lc = Channel(lq, rq)
    rc = Channel(rq, lq)

    return lc, rc


class Channel[T]:
    """In-memory two-way channel."""

    def __init__(self, send: queue.Queue, recv: queue.Queue) -> None:
        self.send = send
        self.recv = recv

    def put(self, msg: T) -> None:
        """Send a message."""
        self.send.put(msg)

    def get(self) -> T:
        """Receive a message. Blocks if necessary until an item is available."""
        return self.recv.get()
