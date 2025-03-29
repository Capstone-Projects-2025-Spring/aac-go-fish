from fastapi.testclient import TestClient
import pytest
from backend.dependencies import LobbyManager, lobby_manager
from backend.hello import app

lm = LobbyManager(lambda: "code")
def lobby_manager_override():
    return lm

app.dependency_overrides[lobby_manager] = lobby_manager_override

@pytest.fixture
def lobby_client() -> TestClient:
    """Create a TestClient with a lobby created."""
    client = TestClient(app)
    client.post("lobby")
    return client

def test_create_lobby(lobby_client: TestClient):
    ...

def test_websocket(lobby_client: TestClient):
    r = lobby_client.post("/lobby/code/join")
    # id = r.json()["id"]
    #
    # with lobby_client.websocket_connect("/ws") as websocket:
    #     websocket.send_text('{"data": {"type": "initializer", "code": "code", "id": "%s"}}' % id)
        # websocket.send_text('{"data": {"type": "lobby_lifecycle", "lifecycle_type": "game_start"}}')
        # websocket.send_text('{"data": {"type": "lobby_lifecycle", "lifecycle_type": "game_end"}}')
        # data = websocket.receive_json()
        # print(data)

    pytest.fail()
