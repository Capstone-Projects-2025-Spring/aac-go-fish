import pytest

from backend.game import GameLoop
from backend.game_state import Lobby
from backend.models import Burger, Drink, Order, Side


@pytest.mark.parametrize(
    ["correct_order", "inp_order", "exp"],
    [
        pytest.param(
            Order(burger=Burger(ingredients=["a", "b"]), side=None, drink=None),
            Order(burger=Burger(ingredients=["a", "b"]), side=None, drink=None),
            5,
            id="correct burger only",
        ),
        pytest.param(
            Order(burger=Burger(ingredients=["a", "b"]), side=Side(table_state="fries"), drink=None),
            Order(burger=Burger(ingredients=["a", "b"]), side=Side(table_state="fries"), drink=None),
            8,
            id="correct burger and side",
        ),
        pytest.param(
            Order(
                burger=Burger(ingredients=["a", "b"]),
                side=Side(table_state="fries"),
                drink=Drink(color="blue", size="M", fill=100),
            ),
            Order(
                burger=Burger(ingredients=["a", "b"]),
                side=Side(table_state="fries"),
                drink=Drink(color="blue", size="M", fill=100),
            ),
            12,
            id="correct burger, side, and drink",
        ),
        pytest.param(
            Order(
                burger=Burger(ingredients=["a"]),
                side=None,
                drink=None,
            ),
            Order(
                burger=Burger(ingredients=[]),
                side=None,
                drink=None,
            ),
            3,
            id="incorrect burger",
        ),
        pytest.param(
            Order(
                burger=Burger(ingredients=["a", "b"]),
                side=None,
                drink=None,
            ),
            Order(
                burger=None,
                side=None,
                drink=None,
            ),
            3,
            id="missing burger",
        ),
        pytest.param(
            Order(
                burger=Burger(ingredients=["a", "b"]),
                side=Side(table_state="fries"),
                drink=None,
            ),
            Order(
                burger=Burger(ingredients=["a", "b"]),
                side=None,
                drink=None,
            ),
            6,
            id="correct burger and missing side",
        ),
    ],
)
def test_grade_order(correct_order: Order, inp_order: Order, exp: float) -> None:
    """Test grade order."""
    game_loop = GameLoop(lobby=Lobby(code=("Lettuce", "Tomato", "Onion")))
    game_loop.order = correct_order

    out = game_loop.grade_order(inp_order)

    assert exp == out


@pytest.mark.parametrize(
    ["correct_color", "inp_color", "color_score"],
    [
        ["blue", "orange", 0],
        ["blue", "blue", 2/3],
    ],
)
@pytest.mark.parametrize(
    ["correct_size", "inp_size", "size_score"],
    [
        ["M", "L", 0],
        ["M", "M", 2/3],
    ],
)
@pytest.mark.parametrize(
    "inp_fill",
    range(100 + 1)
)
def test_grade_order_drink(
    correct_color: str,
    inp_color: str,
    color_score: float,
    correct_size: str,
    inp_size: str,
    size_score: float,
    inp_fill: float,
) -> None:
    """Grade order test for drinks specifically to take advantage of parameter matrix."""
    game_loop = GameLoop(lobby=Lobby(("Lettuce", "Tomato", "Onion")))
    game_loop.order = Order(
        burger=Burger(ingredients=["a", "b"]),
        side=Side(table_state="fries"),
        drink=Drink(color=correct_color, size=correct_size, fill=100),
    )

    inp_order = Order(
        burger=Burger(ingredients=["a", "b"]),
        side=Side(table_state="fries"),
        drink=Drink(color=inp_color, size=inp_size, fill=inp_fill),
    )
    fill_mult = (1 - abs(1 - inp_fill / 100)) ** 0.5

    out = game_loop.grade_order(inp_order)

    assert round(10 + color_score + size_score + 2/3 * fill_mult, 2) == out
