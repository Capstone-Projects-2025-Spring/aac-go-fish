import pytest

from backend.models import (
    Burger,
    Chat,
    DayEnd,
    Drink,
    GameEnd,
    GameStart,
    Initializer,
    Message,
    NewOrder,
    Order,
    OrderComponent,
    OrderScore,
    OrderSubmission,
    PlayerJoin,
    PlayerLeave,
    Role,
    RoleAssignment,
    Side,
)


@pytest.mark.parametrize(
    ["inp", "exp"],
    [
        pytest.param(
            '{"data": {"type": "initializer", "code": ["Lettuce", "Tomato", "Onion"], "id": "id"}}',
            Message(data=Initializer(code=("Lettuce", "Tomato", "Onion"), id="id")),
            id="Initializer",
        ),
        pytest.param(
            """\
            {
                "data": {
                    "type": "game_state",
                    "game_state_update_type": "new_order",
                    "order": {
                        "burger": {"ingredients": ["bread", "bread"]},
                        "side": {"table_state": "fries"},
                        "drink": {"color": "green", "fill": 0, "ice": true, "size": "S"}
                    }
                }
            }""",
            Message(
                data=NewOrder(
                    order=Order(
                        burger=Burger(ingredients=["bread", "bread"]),
                        side=Side(table_state="fries"),
                        drink=Drink(color="green", fill=0, size="S"),
                    )
                )
            ),
            id="NewOrder",
        ),
        pytest.param(
            """\
            {
                "data": {
                    "type": "game_state",
                    "game_state_update_type": "role_assignment",
                    "role": "manager"
                }
            }""",
            Message(data=RoleAssignment(role=Role.manager)),
            id="RoleAssignment",
        ),
        pytest.param(
            '{"data": {"type": "game_state", "game_state_update_type": "order_score", "score": 1}}',
            Message(data=OrderScore(score=1)),
            id="OrderScore",
        ),
        pytest.param(
            """\
            {
                "data": {
                    "type": "game_state",
                    "game_state_update_type": "order_component",
                    "component_type": "burger",
                    "component": {"ingredients": ["bread", "bread"]}
                }
            }""",
            Message(data=OrderComponent(component_type="burger", component=Burger(ingredients=["bread", "bread"]))),
            id="OrderComponent",
        ),
        pytest.param(
            """\
            {
                "data": {
                    "type": "game_state",
                    "game_state_update_type": "order_submission",
                    "order": {
                        "burger": {"ingredients": ["bread", "bread"]},
                        "side": {"table_state": "fries"},
                        "drink": {"color": "green", "fill": 0, "ice": true, "size": "S"}
                    }
                }
            }""",
            Message(
                data=OrderSubmission(
                    order=Order(
                        burger=Burger(ingredients=["bread", "bread"]),
                        side=Side(table_state="fries"),
                        drink=Drink(color="green", fill=0, size="S"),
                    )
                )
            ),
            id="OrderSubmission",
        ),
        pytest.param(
            """\
            {
                "data": {
                    "type": "game_state",
                    "game_state_update_type": "day_end",
                    "day": 0,
                    "customers_served": 0,
                    "score": 0
                }
            }""",
            Message(data=DayEnd(day=0, customers_served=0, score=0)),
            id="DayEnd",
        ),
        pytest.param(
            '{"data": {"type": "lobby_lifecycle", "lifecycle_type": "player_join", "id": "id"}}',
            Message(data=PlayerJoin(id="id")),
            id="PlayerJoin",
        ),
        pytest.param(
            '{"data": {"type": "lobby_lifecycle", "lifecycle_type": "player_leave", "id": "id"}}',
            Message(data=PlayerLeave(id="id")),
            id="PlayerLeave",
        ),
        pytest.param(
            '{"data": {"type": "lobby_lifecycle", "lifecycle_type": "game_start"}}',
            Message(data=GameStart()),
            id="GameStart",
        ),
        pytest.param(
            '{"data": {"type": "lobby_lifecycle", "lifecycle_type": "game_end"}}',
            Message(data=GameEnd()),
            id="GameEnd",
        ),
        pytest.param(
            '{"data": {"type": "chat", "typing": false}}',
            Message(data=Chat(typing=False)),
            id="Chat",
        ),
    ],
)
def test_deserialize(inp: str, exp: Message) -> None:
    """Test models are deserialized correctly."""
    assert Message.model_validate_json(inp) == exp
