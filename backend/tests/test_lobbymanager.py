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


def test_no_more_lobbies(lm: LobbyManager) -> None:
    """Test RuntimeError is thrown when no more lobbies are available."""
    for _ in range(len(lm.available_codes)):
        lm.register_lobby()

    with pytest.raises(RuntimeError) as exc_info:
        lm.register_lobby()

    assert exc_info.type is RuntimeError
    assert str(exc_info.value) == "No more lobby codes available, server is full"


def test_different_lobbies_have_different_codes(lm: LobbyManager) -> None:
    """Test that different lobbies have different codes."""
    codes = [lm.register_lobby() for _ in range(10)]
    assert len(codes) == len(set(codes))


def test_register_player_invalid_code(lm: LobbyManager) -> None:
    """Test ValueError is thrown on invalid codes."""
    with pytest.raises(ValueError) as exc_info:
        lm.register_player(("Top Bun", "Not a real ingredient"))

    assert exc_info.type is ValueError


def test_register_player(lm: LobbyManager) -> None:
    """Test a player can be added correctly."""
    code = lm.register_lobby()
    lm.register_player(code)

    assert len(lm.lobbies[code].players) == 1
