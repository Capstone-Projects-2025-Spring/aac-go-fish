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

    def get(self, block: bool = True) -> T | None:
        """
        Receive a message.

        Args:
            block: If True, block until there is a message available. Otherwise, return None if empty.
        """
        try:
            return self.recv.get(block)
        except queue.Empty:
            return None
