import React from "react";
import BurgerDisplay from "../Burger/BurgerDisplay";
import SideDisplay from "../Sides/SideDisplay";
import DrinkDisplay from "../Drinks/DrinkDisplay";
import { menuMap } from "../../menuItems";

import "./MiniOrderDisplay.css";

export default function MiniOrderDisplay({ burger, drink, side }) {
    const isBurger = burger !== null;
    const isSide = side !== null;
    const isDrink = drink !== null;

    return (
        (isBurger || isSide || isDrink) && (
            <div className="mini-order-display">
                <div className="burger" style={{...(!isDrink && !isSide && {transform: 'scale(1.2)', position: 'relative', left: '7rem'})}}>
                    {isBurger ? (
                    <BurgerDisplay
                        imagePaths={burger.map((ingredient) => {
                            if (typeof ingredient === "string") {
                                return menuMap.Burger[ingredient]?.sideImage ?? "";
                            } else if (ingredient.sideImage) {
                                return ingredient.sideImage;
                            }
                            return "";
                        })}
                    />
                    ) : null}
                </div>
                <div className="drink">
                    {isDrink ? (
                        <DrinkDisplay
                        color={drink.color}
                        fillPercentage={drink.fill}
                        cupSize={drink.size}
                        mini={false}
                        cupPosition={0}
                        />
                    ) : null}
                </div>
                <div className="side">
                    {isSide ? (
                        <SideDisplay tableState={side.table_state} manager={true}/>
                    ) : null}
                </div>
            </div>
        )
    );
}
