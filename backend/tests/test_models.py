from backend import models
import pytest


@pytest.mark.parametrize(
    "data,expected",
    [
        (
            '{"data": {"type": "query", "target_player_id": 4, "card": 5}, "source_player_id": 0}',
            models.Query(type=models.MessageKind.query, target_player_id=4, card=5),
        ),
        (
            '{"data": {"type": "query_response", "count": 4}, "source_player_id": 0}',
            models.QueryResponse(type=models.MessageKind.query_response, count=4),
        ),
        (
            '{"data": {"type": "chat", "message": "ayo"}, "source_player_id": 0}',
            models.Chat(type=models.MessageKind.chat, message="ayo"),
        ),
    ],
)
def test_message_deserialize(data: str, expected: models.Query | models.QueryResponse | models.Chat) -> None:
    """Test that Pydantic field discriminator is working as expected."""
    model = models.Message.model_validate_json(data)
    assert model.data == expected
