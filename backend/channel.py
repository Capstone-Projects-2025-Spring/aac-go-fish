from __future__ import annotations

import asyncio


def channel() -> tuple[Channel, Channel]:
    """Create a pair of channels."""
    lq = asyncio.Queue()
    rq = asyncio.Queue()

    lc = Channel(lq, rq)
    rc = Channel(rq, lq)

    return lc, rc


class Channel[T]:
    """In-memory two-way channel."""

    def __init__(self, send: asyncio.Queue, recv: asyncio.Queue) -> None:
        self.send = send
        self.recv = recv

    async def put(self, msg: T) -> None:
        """Send a message."""
        await self.send.put(msg)

    async def get(self) -> T:
        """
        Receive a message.
        """

        return await self.recv.get()
