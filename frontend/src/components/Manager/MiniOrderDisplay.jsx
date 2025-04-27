import React from "react";
import BurgerDisplay from "../Burger/BurgerDisplay";
import SideDisplay from "../Sides/SideDisplay";
import DrinkDisplay from "../Drinks/DrinkDisplay";
import {menuMap} from "../../menuItems";

import "./MiniOrderDisplay.css";

export default function MiniOrderDisplay({burger, drink, side}) {
    const isBurger = burger && burger.length > 0;
    const isSide = !!side;
    const isDrink = drink !== null;

    return <>
        {isBurger && <BurgerDisplay
            imagePaths={burger.map((ingredient) => {
                if (typeof ingredient === "string") {
                    return menuMap.Burger[ingredient]?.sideImage ?? "";
                } else if (ingredient.sideImage) {
                    return ingredient.sideImage;
                }
                return "";
            })}
        />}
        {isDrink && <DrinkDisplay
            color={drink.color}
            fillPercentage={drink.fill}
            cupSize={drink.size}
            mini={false}
            cupPosition={0}
        />}
        {isSide && <SideDisplay tableState={side.table_state} manager={true}/>}
    </>;
}
