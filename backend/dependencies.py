import asyncio

Q = asyncio.Queue(maxsize=10000)


def event_queue():
    return Q
