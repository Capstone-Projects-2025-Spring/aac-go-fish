import pytest

from backend.dependencies import LobbyManager
from backend.game import BURGER_INGREDIENTS


@pytest.fixture
def lm() -> LobbyManager:
    """Pass lobby manager to tests."""
    return LobbyManager()


def test_register_lobby(lm: LobbyManager) -> None:
    """Test a lobby is created correctly."""
    code = lm.register_lobby()
    assert len(code) == 3
    assert all(ingredient in BURGER_INGREDIENTS for ingredient in code)


def test_register_player_invalid_code(lm: LobbyManager) -> None:
    """Test ValueError is thrown on invalid codes."""
    with pytest.raises(ValueError) as exc_info:
        lm.register_player(["Top Bun"])

    assert exc_info.type is ValueError


def test_register_player(lm: LobbyManager) -> None:
    """Test a player can be added correctly."""
    code = lm.register_lobby()
    lm.register_player(code)

    assert len(lm.lobbies[tuple(code)].players) == 1
