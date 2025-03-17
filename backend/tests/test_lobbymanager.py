import pytest
from backend.dependencies import _LobbyManager

def test_register_lobby() -> None:
    """Test a lobby is created correctly."""
    lm = _LobbyManager(lambda: "code")

    code = lm.register_lobby()

    assert code == "code"

    assert lm.lobbies["code"].players == {}
    assert lm.lobbies["code"].code == "code"

def test_register_player_invalid_code() -> None:
    """Test ValueError is thrown on invalid codes"""

    lm = _LobbyManager(lambda: "code")

    with pytest.raises(ValueError) as exc_info:
        lm.register_player("code")

    assert isinstance(exc_info.type, ValueError)


def test_register_player() -> None:
    """Test a player can be added correctly."""
    
    lm = _LobbyManager(lambda: "code")

    code = lm.register_lobby()

    id = lm.register_player(code)

    lm.lobbies[code].players[id].role
