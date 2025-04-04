import pytest
from fastapi.testclient import TestClient

from backend.dependencies import LobbyManager, lobby_manager
from backend.game import Message
from backend.hello import app
from backend.models import Burger, Order, OrderSubmission

lm = LobbyManager(lambda: "code")


def lobby_manager_override() -> LobbyManager:
    """Override lobby manager."""
    return lm


app.dependency_overrides[lobby_manager] = lobby_manager_override


@pytest.fixture
def lobby_client() -> TestClient:
    """Create a TestClient with a lobby created."""
    client = TestClient(app)
    client.post("lobby")
    return client


@pytest.mark.skip(reason="Test function hangs occasionally")
def test_websocket(lobby_client: TestClient) -> None:
    """Test that websocket connection does not hang."""
    player_1_response = lobby_client.post("/lobby/code/join")
    lobby_client.post("/lobby/code/join")
    player_1_id = player_1_response.json()["id"]

    with lobby_client.websocket_connect("/ws") as websocket:
        websocket.send_text('{"data": {"type": "initializer", "code": "code", "id": "%s"}}' % player_1_id)
        websocket.send_text('{"data": {"type": "lobby_lifecycle", "lifecycle_type": "game_start"}}')
        msg = websocket.receive_json()["data"]

        order = msg["order"]
        burger = order["burger"]

        # since we have only one cook, we should have a burger, but no drink or
        # side.
        # technically speaking, we _could_ inject a random.Random for testing,
        # but that seems like too much effort for not much gain
        assert burger["ingredients"][0] == "bottom bun"
        assert burger["ingredients"][-1] == "top bun"

        assert order["drink"] is None
        assert order["fry"] is None


@pytest.mark.skip(reason="Test function hangs occasionally")
def test_websocket_spam_chat(lobby_client: TestClient) -> None:
    """Test that a bunch of chat messages are received and broadcast without pausing."""
    id = lobby_client.post("/lobby/code/join").json()["id"]

    client_2 = TestClient(app)
    id_2 = client_2.post("/lobby/code/join").json()["id"]

    with (
        lobby_client.websocket_connect("/ws") as websocket_1,
        client_2.websocket_connect("/ws") as websocket_2,
    ):
        websocket_1.send_text('{"data": {"type": "initializer", "code": "code", "id": "%s"}}' % id)
        websocket_2.send_text('{"data": {"type": "initializer", "code": "code", "id": "%s"}}' % id_2)

        for _ in range(10):
            websocket_1.send_text('{"data": {"type": "chat", "typing": true, "id": "%s"}}' % id)

        for _ in range(10):
            assert websocket_2.receive_json()["data"]["id"] == id


@pytest.mark.skip(reason="Test function hangs occasionally")
def test_websocket_submit_burger_order(lobby_client: TestClient) -> None:
    """Test that we get a score after submitting an order."""
    id = lobby_client.post("/lobby/code/join").json()["id"]
    with lobby_client.websocket_connect("/ws") as websocket:
        websocket.send_text('{"data": {"type": "initializer", "code": "code", "id": "%s"}}' % id)
        websocket.send_text('{"data": {"type": "lobby_lifecycle", "lifecycle_type": "game_start"}}')

        order = websocket.receive_json()["data"]["order"]
        m = Message(
            data=OrderSubmission(
                order=Order(burger=Burger(ingredients=order["burger"]["ingredients"]), drink=None, fry=None)
            )
        )
        websocket.send_text(m.model_dump_json())
        # print(websocket.receive_json())
