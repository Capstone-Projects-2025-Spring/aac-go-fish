import BurgerDisplay from "./BurgerDisplay";
import SideDisplay from "./SideDisplay";
import DrinkDisplay from "./DrinkDisplay";
import "./MiniOrderDisplay.css"
import React from "react";

export default function MiniOrderDisplay({ burger, side, drink }) {
    return ((burger || side || drink) && <>
        <div className="mini-order-display">
            {burger !== null && (<BurgerDisplay imagePaths={burger.map((ingredient) => ingredient.sideImage)}/>)}
            {side !== null && (<SideDisplay tableState={side.tableState}/>)}
            {drink !== null && (<DrinkDisplay layers={drink.layers} hasIce={drink.hasIce}/>)}
        </div>
        </>
    );
}