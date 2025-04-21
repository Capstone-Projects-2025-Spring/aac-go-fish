import pytest
from fastapi.testclient import TestClient

from backend.dependencies import LobbyManager, lobby_manager
from backend.hello import app

lm = LobbyManager(["a", "b", "c"])


def lobby_manager_override() -> LobbyManager:
    """Override lobby manager."""
    return lm


app.dependency_overrides[lobby_manager] = lobby_manager_override


@pytest.fixture
def lobby_client() -> TestClient:
    """Create a TestClient."""
    client = TestClient(app)
    return client


@pytest.mark.slow
def test_websocket(lobby_client: TestClient) -> None:
    """Test that websocket connection does not hang."""
    code = lobby_client.post("lobby").json()["code"]
    player_1_id = lobby_client.post("/lobby/join", json={"code": code}).json()["id"]
    player_2_id = lobby_client.post("/lobby/join", json={"code": code}).json()["id"]

    with lobby_client.websocket_connect("/ws") as websocket_1, lobby_client.websocket_connect("/ws") as websocket_2:
        websocket_1.send_json(dict(data=dict(type="initializer", code=code, id=player_1_id)))
        websocket_2.send_json(dict(data=dict(type="initializer", code=code, id=player_2_id)))

        # since player_1 joins first, this should be a player count message with count=1
        player_count = websocket_1.receive_json()
        assert player_count["data"]["count"] == 1
        # the next message for player_1 will be the player count update for player_2 joining
        player_count = websocket_1.receive_json()
        assert player_count["data"]["count"] == 2

        # whereas player_2 should only get the player count for player_2 joining
        player_count = websocket_2.receive_json()
        assert player_count["data"]["count"] == 2

        # player_1 starts the game...
        websocket_1.send_json(dict(data=dict(type="lobby_lifecycle", lifecycle_type="game_start")))

        # ...so player_2 receives the start broadcast
        data = websocket_2.receive_json()["data"]
        assert data["lifecycle_type"] == "game_start"

        # next message is the role assignment
        player_1_role = websocket_1.receive_json()["data"]
        _ = websocket_2.receive_json()["data"]

        if player_1_role["role"] == "manager":
            manager = websocket_1
            cook = websocket_2
        else:
            manager = websocket_2
            cook = websocket_1

        # next message to the manager should be the order
        data = manager.receive_json()["data"]
        order = data["order"]
        burger = order["burger"]["ingredients"]
        assert burger[0] == "Bottom Bun"
        assert burger[-1] == "Top Bun"

        # cook should send an order component...
        cook.send_json(
            dict(
                data=dict(
                    type="game_state",
                    game_state_update_type="order_component",
                    component_type="burger",
                    component=dict(ingredients=burger),
                )
            )
        )

        # ...which should be sent to the manager
        data = manager.receive_json()["data"]
        assert data["component"]["ingredients"] == burger

        # manager submits order
        manager.send_json(
            dict(
                data=dict(
                    type="game_state",
                    game_state_update_type="order_submission",
                    order=dict(burger=dict(ingredients=burger), side=None, drink=None),
                )
            )
        )

        # and gets a score
        data = manager.receive_json()["data"]

        # a perfect burger gets 500
        assert data["score"] == 500


@pytest.mark.slow
def test_websocket_spam_chat(lobby_client: TestClient) -> None:
    """Test that a bunch of chat messages are received and broadcast without pausing."""
    code = lobby_client.post("lobby").json()["code"]
    player_1_id = lobby_client.post("/lobby/join", json={"code": code}).json()["id"]
    player_2_id = lobby_client.post("/lobby/join", json={"code": code}).json()["id"]

    with lobby_client.websocket_connect("/ws") as websocket_1, lobby_client.websocket_connect("/ws") as websocket_2:
        websocket_1.send_json(dict(data=dict(type="initializer", code=code, id=player_1_id)))
        websocket_2.send_json(dict(data=dict(type="initializer", code=code, id=player_2_id)))

        # since player_1 joins first, this should be a player count message with count=1
        player_count = websocket_1.receive_json()
        assert player_count["data"]["count"] == 1
        # the next message for player_1 will be the player count update for player_2 joining
        player_count = websocket_1.receive_json()
        assert player_count["data"]["count"] == 2

        # whereas player_2 should only get the player count for player_2 joining
        player_count = websocket_2.receive_json()
        assert player_count["data"]["count"] == 2

        for _ in range(10):
            websocket_1.send_json(dict(data=dict(type="chat", typing=True, id=player_1_id)))

        for _ in range(10):
            data = websocket_2.receive_json()["data"]
            assert data["type"] == "chat"
