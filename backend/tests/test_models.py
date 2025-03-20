import pytest

from backend.models import (
    Chat,
    DayEnd,
    GameEnd,
    GameStart,
    Initializer,
    Message,
    NewOrder,
    OrderScore,
    OrderSubmission,
    PlayerJoin,
    PlayerLeave,
    Role,
    RoleAssignment,
)


@pytest.mark.parametrize(
    ["inp", "exp"],
    [
        pytest.param(
            '{"data": {"type": "initializer", "code": "code", "id": "id"}}',
            Message(data=Initializer(code="code", id="id")),
            id="Initializer",
        ),
        pytest.param(
            '{"data": {"type": "game_state", "game_state_update_type": "new_order"}}',
            Message(data=NewOrder()),
            id="NewOrder",
        ),
        pytest.param(
            """\
            {
                "data": {
                    "type": "game_state",
                    "game_state_update_type": "role_assignment",
                    "id": "id",
                    "role": "manager"
                }
            }""",
            Message(data=RoleAssignment(id="id", role=Role.manager)),
            id="RoleAssignment",
        ),
        pytest.param(
            '{"data": {"type": "game_state", "game_state_update_type": "order_score", "score": 1}}',
            Message(data=OrderScore(score=1)),
            id="OrderScore",
        ),
        pytest.param(
            '{"data": {"type": "game_state", "game_state_update_type": "order_submission", "order": []}}',
            Message(data=OrderSubmission(order=[])),
            id="OrderSubmission",
        ),
        pytest.param(
            '{"data": {"type": "game_state", "game_state_update_type": "day_end"}}',
            Message(data=DayEnd()),
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
            '{"data": {"type": "chat", "id": "id", "typing": false}}',
            Message(data=Chat(id="id", typing=False)),
            id="Chat",
        ),
    ],
)
def test_deserialize(inp: str, exp: Message) -> None:
    """Test models are deserialized correctly."""
    assert Message.model_validate_json(inp) == exp
