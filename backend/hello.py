import asyncio
import logging
import typing
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, WebSocket

from .dependencies import Channel, LobbyManager, lobby_manager, settings
from .models import Annotated, Initializer, Message

logger = logging.getLogger(__file__)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator:
    """Setup demo if necessary."""
    s = settings()
    if s.env == "demo":
        lobby = lobby_manager()
        lobby.register_lobby()
    yield


app = FastAPI(lifespan=lifespan)


@app.post("/lobby")
def create_lobby(lm: Annotated[LobbyManager, Depends(lobby_manager)]) -> dict[str, str]:
    """Creates a new lobby."""
    code = lm.register_lobby()

    return {"code": code}


@app.post("/lobby/{code}/join")
def join_lobby(code: str, lm: Annotated[LobbyManager, Depends(lobby_manager)]) -> dict[str, str]:
    """Joins a player to a lobby by its unique game code."""
    try:
        id = lm.register_player(code)
    except ValueError:
        raise HTTPException(status_code=404, detail="Lobby not found")

    return {"id": id}


@app.get("/")
async def read_root() -> dict:
    """Returns a simple message at root."""
    return {"Hello": "World"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, lm: Annotated[LobbyManager, Depends(lobby_manager)]) -> None:
    """Handles a WebSocket connection for receiving and responding to messages."""
    await websocket.accept()

    init = Initializer.model_validate_json(await websocket.receive_text())
    channel = lm.channel(init.code, init.id)

    await asyncio.gather(_recv_handler(websocket, channel), _send_handler(websocket, channel))


async def _recv_handler(websocket: WebSocket, channel: Channel[Message]) -> typing.Never:
    while True:
        data = Message.model_validate_json(await websocket.receive_text())
        channel.send(data)


async def _send_handler(websocket: WebSocket, channel: Channel[Message]) -> typing.Never:
    while True:
        msg: Message = channel.recv()
        await websocket.send_text(msg.model_dump_json())
