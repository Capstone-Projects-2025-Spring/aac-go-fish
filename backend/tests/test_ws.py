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
def test_websocket_full_order(lobby_client: TestClient) -> None:
    """Test that websocket handles all 4 players and full order flow."""
    code = lobby_client.post("lobby").json()["code"]

    player_ids = [lobby_client.post("/lobby/join", json={"code": code}).json()["id"] for _ in range(4)]
    websockets = [lobby_client.websocket_connect("/ws") for _ in range(4)]

    with websockets[0] as ws1, websockets[1] as ws2, websockets[2] as ws3, websockets[3] as ws4:
        sockets = [ws1, ws2, ws3, ws4]

        # Send initializer messages
        for ws, pid in zip(sockets, player_ids, strict=False):
            ws.send_json({"data": {"type": "initializer", "code": code, "id": pid}})

        # Each websocket receives player count updates
        for ws in sockets:
            while True:
                msg = ws.receive_json()
                if msg["data"].get("count") == 4:
                    break

        # Start game from first player
        ws1.send_json({"data": {"type": "lobby_lifecycle", "lifecycle_type": "game_start"}})

        # Wait for game start broadcast and role assignments
        roles = {}
        for ws, _ in zip(sockets, player_ids, strict=False):
            data = ws.receive_json()["data"]
            if data.get("lifecycle_type") == "game_start":
                data = ws.receive_json()["data"]
            roles[data["role"]] = ws

        assert {"manager", "burger", "side", "drink"} == set(roles)

        manager = roles["manager"]
        burger_cook = roles["burger"]
        side_cook = roles["side"]
        drink_cook = roles["drink"]

        # Manager receives an order
        data = manager.receive_json()["data"]
        order = data["order"]
        burger = order["burger"]["ingredients"]
        side = order["side"]["table_state"]
        drink = order["drink"]

        # Burger cook sends component
        burger_cook.send_json(
            {
                "data": {
                    "type": "game_state",
                    "game_state_update_type": "order_component",
                    "component_type": "burger",
                    "component": {"ingredients": burger},
                }
            }
        )
        data = manager.receive_json()["data"]
        assert data["component"]["ingredients"] == burger

        # Side cook sends component
        side_cook.send_json(
            {
                "data": {
                    "type": "game_state",
                    "game_state_update_type": "order_component",
                    "component_type": "side",
                    "component": {"table_state": side},
                }
            }
        )
        data = manager.receive_json()["data"]
        assert data["component"]["table_state"] == side

        # Drink cook sends component
        drink_cook.send_json(
            {
                "data": {
                    "type": "game_state",
                    "game_state_update_type": "order_component",
                    "component_type": "drink",
                    "component": {"color": drink["color"], "fill": drink["fill"], "size": drink["size"]},
                }
            }
        )
        data = manager.receive_json()["data"]
        assert data["component"]["color"] == drink["color"]

        # Manager submits complete order
        manager.send_json(
            {
                "data": {
                    "type": "game_state",
                    "game_state_update_type": "order_submission",
                    "order": {
                        "burger": {"ingredients": burger},
                        "side": {"table_state": side},
                        "drink": {"color": drink["color"], "fill": drink["fill"], "size": drink["size"]},
                    },
                }
            }
        )

        # Manager receives score
        score_msg = manager.receive_json()["data"]
        assert "score" in score_msg
        assert score_msg["score"] == 1200


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
