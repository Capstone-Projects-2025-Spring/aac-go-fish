import asyncio
import time
import typing
from collections.abc import AsyncGenerator, Awaitable, Callable
from contextlib import asynccontextmanager

import structlog
from asgi_correlation_id import CorrelationIdMiddleware, correlation_id
from fastapi import Depends, FastAPI, HTTPException, Request, Response, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from uvicorn.protocols.utils import get_path_with_query_string

from .dependencies import Channel, LobbyManager, lobby_manager, settings
from .game_state import LobbyClosedError, LobbyFullError, LobbyNotFoundError, TaggedMessage
from .logging_config import setup_logging
from .models import Annotated, Initializer, LobbyJoinRequest, Message

access_logger = structlog.stdlib.get_logger("api.access")


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator:
    """Setup demo if necessary."""
    s = settings()
    if s.env == "demo":
        lobby = lobby_manager()
        lobby.register_lobby()

    if s.env == "prod":
        json_logs = True
    else:
        json_logs = False

    setup_logging(json_logs=json_logs, log_level=s.log_level)

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings().frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def logging_middleware(request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
    """Add log info to all requests."""
    structlog.contextvars.clear_contextvars()
    # These context vars will be added to all log entries emitted during the request
    request_id = correlation_id.get()
    structlog.contextvars.bind_contextvars(request_id=request_id)

    start_time = time.perf_counter_ns()
    # If the call_next raises an error, we still want to return our own 500
    # response, so we can add headers to it (process time, request ID...)
    response = Response(status_code=500)
    try:
        response = await call_next(request)
    except Exception:
        structlog.stdlib.get_logger("api.error").exception("Uncaught exception")
        raise
    finally:
        process_time = time.perf_counter_ns() - start_time

        status_code = response.status_code
        url = get_path_with_query_string(request.scope)  # pyright: ignore[reportArgumentType]
        client_host = request.client.host if request.client else ""
        client_port = request.client.port if request.client else ""
        http_method = request.method
        http_version = request.scope["http_version"]
        # Recreate the Uvicorn access log format, but add all parameters as
        # structured information
        access_logger.info(
            f"""{client_host}:{client_port} - "{http_method} {url} HTTP/{http_version}" {status_code}""",
            http={
                "url": str(request.url),
                "status_code": status_code,
                "method": http_method,
                "request_id": request_id,
                "version": http_version,
            },
            network={"client": {"ip": client_host, "port": client_port}},
            duration=process_time,
        )
        response.headers["X-Process-Time"] = str(process_time / 10**9)
        return response  # noqa: B012


app.add_middleware(CorrelationIdMiddleware)

logger = structlog.stdlib.get_logger()


@app.post("/lobby")
def create_lobby(lm: Annotated[LobbyManager, Depends(lobby_manager)]) -> dict[str, tuple[str, ...]]:
    """Creates a new lobby."""
    code = lm.register_lobby()

    return {"code": code}


@app.post("/lobby/join")
def join_lobby(req: LobbyJoinRequest, lm: Annotated[LobbyManager, Depends(lobby_manager)]) -> dict[str, str]:
    """Joins a player to a lobby using a list of ingredients as the code."""
    try:
        id = lm.register_player(req.code)
    except LobbyFullError:
        raise HTTPException(status_code=403, detail="Lobby is full")
    except LobbyNotFoundError:
        raise HTTPException(status_code=404, detail="Lobby not found")
    except LobbyClosedError:
        raise HTTPException(status_code=403, detail="Lobby has already started")

    return {"id": id}


@app.get("/")
async def read_root() -> dict:
    """Returns a simple message at root."""
    return {"Hello": "World"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, lm: Annotated[LobbyManager, Depends(lobby_manager)]) -> None:
    """Handles a WebSocket connection for receiving and responding to messages."""
    await websocket.accept()

    try:
        init = Message.model_validate(await websocket.receive_json())
    except ValidationError:
        logger.debug("Received invalid websocket message.")
        await websocket.close()
        return

    match init:
        case Message(data=Initializer(code=code, id=id)):
            channel = lm.channel(code, id)
            logger.info("WebSocket connection initialized.", player=id)
        case _:
            logger.info("WebSocket connection failed to initialize.", message=init)
            await websocket.close()
            return

    await asyncio.gather(_recv_handler(id, websocket, channel), _send_handler(id, websocket, channel))


async def _recv_handler(id: str, websocket: WebSocket, channel: Channel[TaggedMessage, Message]) -> typing.Never:
    while True:
        raw = await websocket.receive_text()
        try:
            data = Message.model_validate_json(raw)
        except ValidationError:
            logger.warning("Received invalid websocket message.", data=raw)
        else:
            logger.debug("Received WebSocket message.", message=data, player=id)
            channel.send(TaggedMessage(data=data.data, id=id))


async def _send_handler(id: str, websocket: WebSocket, channel: Channel[TaggedMessage, Message]) -> typing.Never:
    while True:
        msg = await channel.arecv()
        logger.debug("Sending WebSocket message.", message=msg, player=id)
        await websocket.send_text(msg.model_dump_json())
