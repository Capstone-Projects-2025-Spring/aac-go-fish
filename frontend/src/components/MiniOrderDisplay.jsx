import BurgerDisplay from "./BurgerDisplay";
import SideDisplay from "./SideDisplay";
import DrinkDisplay from "./DrinkDisplay";
import "./MiniOrderDisplay.css"
import React from "react";

export default function MiniOrderDisplay({ burger, side, drink }) {
    return ((burger || side || drink) && <>
        <h2>Order (from employees)</h2>
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
            transform: "scale(0.5)",
            height: "15.0rem",
            width: "30.0rem",
            gap: "15.0rem"
        }}>
            {burger !== null && (<BurgerDisplay imagePaths={burger.map((ingredient) => ingredient.sideImage)}/>)}
            {side !== null && (<SideDisplay tableState={side.tableState}/>)}
            {drink !== null && (<DrinkDisplay layers={drink.layers} hasIce={drink.hasIce}/>)}
        </div>
        </>
    );
}