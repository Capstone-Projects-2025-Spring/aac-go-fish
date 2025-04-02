import BurgerDisplay from "./BurgerDisplay";
import SideDisplay from "./SideDisplay";
import DrinkDisplay from "./DrinkDisplay";
import "./MiniOrderDisplay.css"
import React from "react";
import { menuMap } from "../menuItems";

export default function MiniOrderDisplay({ burger, side, drink }) {
    const isBurger = burger && burger.length > 0;
    const isSide = !!side;
    const isDrink = drink !== null;

    return ((isBurger || isSide || isDrink) && <>
        <div className="mini-order-display">
            {isBurger && (<BurgerDisplay imagePaths={burger.map(ingredient => menuMap.Burger[ingredient].sideImage)}/>)}
            {isSide && (<SideDisplay tableState={side.tableState}/>)}
            {isDrink && (<DrinkDisplay color={drink.color} hasIce={drink.ice} fillPercentage={drink.fill}
            cupSize={drink.cupSize}/>)}
        </div>
        </>
    );
}
