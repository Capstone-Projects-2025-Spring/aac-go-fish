from dependencies import LobbyManager, lobby_manager
from fastapi import Depends, FastAPI, HTTPException, WebSocket

from .models import Annotated, Initializer, Message

app = FastAPI()


@app.post("/lobby")
def create_lobby(lm: Annotated[LobbyManager, Depends(lobby_manager)]) -> dict[str, str]:
    """Creates a new lobby."""
    code, id = lm.register_lobby()

    return {"code": code, "id": id}


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

    init = Initializer.model_validate(await websocket.receive_text())
    channel = lm.channel(init.code, init.id)

    while True:
        data = await websocket.receive_text()

        try:
            incoming_message = Message.model_validate(data)
        except Exception as e:
            await websocket.send_text(f"[Server] Error: {e!s}")
        else:
            channel.send(incoming_message)

        # outgoing_message = channel.recv()
