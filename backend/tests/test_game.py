import pytest

from backend.game import GameLoop
from backend.game_state import Lobby
from backend.models import Burger, Drink, Fry, Order


@pytest.mark.parametrize(
    ["correct_order", "inp_order", "exp"],
    [
        pytest.param(
            Order(burger=Burger(ingredients=["a", "b"]), fry=None, drink=None),
            Order(burger=Burger(ingredients=["a", "b"]), fry=None, drink=None),
            5,
            id="correct burger only",
        ),
        pytest.param(
            Order(burger=Burger(ingredients=["a", "b"]), fry=Fry(), drink=None),
            Order(burger=Burger(ingredients=["a", "b"]), fry=Fry(), drink=None),
            8,
            id="correct burger and fry",
        ),
        pytest.param(
            Order(
                burger=Burger(ingredients=["a", "b"]),
                fry=Fry(),
                drink=Drink(color="blue", size="M", fill=100, ice=True),
            ),
            Order(
                burger=Burger(ingredients=["a", "b"]),
                fry=Fry(),
                drink=Drink(color="blue", size="M", fill=100, ice=True),
            ),
            12,
            id="correct burger, fry, and drink",
        ),
        pytest.param(
            Order(
                burger=Burger(ingredients=["a"]),
                fry=None,
                drink=None,
            ),
            Order(
                burger=Burger(ingredients=[]),
                fry=None,
                drink=None,
            ),
            3,
            id="incorrect burger",
        ),
        pytest.param(
            Order(
                burger=Burger(ingredients=["a", "b"]),
                fry=None,
                drink=None,
            ),
            Order(
                burger=None,
                fry=None,
                drink=None,
            ),
            3,
            id="missing burger",
        ),
        pytest.param(
            Order(
                burger=Burger(ingredients=["a", "b"]),
                fry=Fry(),
                drink=None,
            ),
            Order(
                burger=Burger(ingredients=["a", "b"]),
                fry=None,
                drink=None,
            ),
            6,
            id="correct burger and missing fry",
        ),
    ],
)
def test_grade_order(correct_order: Order, inp_order: Order, exp: float) -> None:
    """Test grade order."""
    game_loop = GameLoop(lobby=Lobby())
    game_loop.order = correct_order

    out = game_loop.grade_order(inp_order)

    assert exp == out


@pytest.mark.parametrize(
    ["correct_color", "inp_color", "color_score"],
    [
        ["blue", "orange", 0],
        ["blue", "blue", 0.5],
    ],
)
@pytest.mark.parametrize(
    ["correct_size", "inp_size", "size_score"],
    [
        ["M", "L", 0],
        ["M", "M", 0.5],
    ],
)
@pytest.mark.parametrize(
    ["correct_ice", "inp_ice", "ice_score"],
    [
        [True, False, 0],
        [True, True, 0.5],
        [False, True, 0],
        [False, False, 0.5],
    ],
)
@pytest.mark.parametrize(
    "inp_fill",
    [
        100,
        75,
        80,
    ],
)
def test_grade_order_drink(
    correct_color: str,
    inp_color: str,
    color_score: float,
    correct_size: str,
    inp_size: str,
    size_score: float,
    correct_ice: bool,
    inp_ice: bool,
    ice_score: float,
    inp_fill: float,
) -> None:
    """Grade order test for drinks specifically to take advantage of parameter matrix."""
    game_loop = GameLoop(lobby=Lobby())
    game_loop.order = Order(
        burger=Burger(ingredients=["a", "b"]),
        fry=Fry(),
        drink=Drink(color=correct_color, size=correct_size, ice=correct_ice, fill=100),
    )

    inp_order = Order(
        burger=Burger(ingredients=["a", "b"]),
        fry=Fry(),
        drink=Drink(color=inp_color, size=inp_size, ice=inp_ice, fill=inp_fill),
    )
    fill_mult = (1 - abs(1 - inp_fill / 100)) ** 0.5

    out = game_loop.grade_order(inp_order)

    assert round(10 + color_score + size_score + ice_score + 0.5 * fill_mult, 2) == out
