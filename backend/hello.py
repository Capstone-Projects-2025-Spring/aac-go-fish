import random

from fastapi import FastAPI, HTTPException, WebSocket
from models import Message

app = FastAPI()

lobbies = {}
animals = ["Fish", "Turtle", "Shark"]


def generate_unique_code() -> str:
    """Generates a unique game lobby code."""
    while True:
        code = "-".join(random.choices(animals, k=3))
        if code not in lobbies:
            return code


@app.post("/create_lobby")
def create_lobby() -> dict:
    """Creates a new lobby and returns its unique game lobby code."""
    code = generate_unique_code()
    lobbies[code] = {"players": []}
    return {"code": code}


@app.get("/lobby/{code}")
def get_lobby(code: str) -> dict:
    """Retrieves the lobby information by its unique game code."""
    lobby = lobbies.get(code)
    if lobby is None:
        return {"error": "Lobby not found"}
    return {"code": code, "players": lobby["players"]}


@app.post("/lobby/{code}/join")
def join_lobby(code: str, player: str) -> dict:
    """Joins a player to a lobby by its unique game code."""
    try:
        lobby = lobbies[code]
    except KeyError:
        raise HTTPException(status_code=404, detail="Lobby not found")
    lobby["players"].append(player)
    return {"code": code, "players": lobby["players"]}


@app.get("/")
async def read_root() -> dict:
    """Returns a simple message at root."""
    return {"Hello": "World"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """Handles a WebSocket connection for receiving and responding to messages."""
    await websocket.accept()

    while True:
        data = await websocket.receive_text()

        try:
            message = Message.model_validate(data)
        except Exception as e:
            await websocket.send_text(f"[Server] Error: {e!s}")
        else:
            match message.data.type:
                case _:
                    await websocket.send_text("[Server] Unknown message type received.")
