import pytest

from backend.dependencies import LobbyManager


def test_register_lobby() -> None:
    """Test a lobby is created correctly."""
    lm = LobbyManager(lambda: "code")

    code = lm.register_lobby()

    assert code == "code"
    assert lm.lobbies["code"].code == "code"


def test_register_player_invalid_code() -> None:
    """Test ValueError is thrown on invalid codes."""
    lm = LobbyManager(lambda: "code")

    with pytest.raises(ValueError) as exc_info:
        lm.register_player("code")

    assert exc_info.type is ValueError


def test_register_player() -> None:
    """Test a player can be added correctly."""
    lm = LobbyManager(lambda: "code")

    code = lm.register_lobby()

    lm.register_player(code)

    assert len(lm.lobbies[code].players) == 1
