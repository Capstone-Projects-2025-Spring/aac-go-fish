import math
import pytest

from backend.game import GameLoop
from backend.game_state import Lobby
from backend.models import Drink, Fry, Order, Burger


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
            4,
            id="missing fry",
        ),
    ],
)
def test_grade_order(correct_order: Order, inp_order: Order, exp: float):
    l = GameLoop(lobby=Lobby())
    l.order = correct_order

    out = l.grade_order(inp_order)

    assert exp == out
