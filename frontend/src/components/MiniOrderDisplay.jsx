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
    console.log("mini order");


    return ((isBurger || isSide || isDrink) && <>
        <div className="mini-order-display">
            {isBurger && (
                <BurgerDisplay
                    imagePaths={burger.map(ingredient => {
                        if (typeof ingredient === "string") {
                            return menuMap.Burger[ingredient]?.sideImage ?? "";
                        } else if (ingredient.sideImage) {
                            return ingredient.sideImage;
                        }
                        return "";
                    })}
                />
            )}
            {isSide && (<SideDisplay tableState={side.tableState} />)}
            {isDrink && (
                <DrinkDisplay
                    color={drink.color}
                    fillPercentage={drink.fillPercentage}
                    cupSize={drink.cupSize}
                    fillOverlay={drink.fillOverlay}
                />
            )}
        </div>
    </>
    );
}
