import BurgerDisplay from "./BurgerDisplay";
import SideDisplay from "./SideDisplay";
import DrinkDisplay from "./DrinkDisplay";
import "./MiniOrderDisplay.css"
import React from "react";

export default function MiniOrderDisplay({ burger, side, drink }) {
    return ((burger && burger.length > 0 || side || drink !== null) && <>
        <div className="mini-order-display">
            {burger && burger.length > 0 && (<BurgerDisplay imagePaths={burger.map((ingredient) => ingredient.sideImage)}/>)}
            {side && (<SideDisplay tableState={side.tableState}/>)}
            {drink !== null && (<DrinkDisplay color={drink.color} hasIce={drink.ice} fillPercentage={drink.fill}
            cupSize={drink.cupSize}/>)}
        </div>
        </>
    );
}
