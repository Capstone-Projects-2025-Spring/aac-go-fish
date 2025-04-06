import pytest

from backend.dependencies import LobbyManager
from backend.game import BURGER_INGREDIENTS


def test_register_lobby() -> None:
    """Test a lobby is created correctly."""
    lm = LobbyManager(lambda: ["Lettuce", "Tomato", "Onion"])

    code = lm.register_lobby()

    for item in code:
        assert item in BURGER_INGREDIENTS


def test_register_player_invalid_code() -> None:
    """Test ValueError is thrown on invalid codes."""
    lm = LobbyManager(lambda: ["Lettuce", "Tomato", "Onion"])
    with pytest.raises(ValueError) as exc_info:
        lm.register_player(["Top Bun"])

    assert exc_info.type is ValueError


def test_register_player() -> None:
    """Test a player can be added correctly."""
    lm = LobbyManager(lambda: ["Lettuce", "Tomato", "Onion"])
    code = lm.register_lobby()

    lm.register_player(code)

    assert len(lm.lobbies[tuple(code)].players) == 1
