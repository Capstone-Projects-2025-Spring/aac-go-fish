import React from 'react';
import './CustomerOrder.css';
import {menu} from "../menuItems";

function CustomerOrder({
    burgerOrder,
    drinkOrder,
    drinkSize,
    hasIce,
    hasSide,
    orderVisible
}) {

    const burgerIngredients = menu[0].children;

    // Temporarily set hasIce to false until ice is fully implemented in the drink station
    hasIce = false;
    return (
        <div className="CustomerOrder">
            <div className="orderDisplay">
                {orderVisible && (
                    <>
                        <div className="burgerOrderDisplay">
                            {[...burgerOrder].map((ingredientName, index) => {
                                const ingredient = burgerIngredients.find(food => food.name === ingredientName);
                                return ingredient && (
                                    <div key={index} className="foodItem">
                                        <img src={ingredient.sideImage} alt={ingredient.name}/>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="sideDisplay">
                            <img
                                src={`/images/${hasSide ? "fries" : "noFries"}.png`}
                                alt={hasSide ? "Fries" : "NoFries"}
                                className={hasSide ? "Fries" : "NoFries"}
                            />
                        </div>
                        <div className="mockDisplayCup" style={{backgroundColor: drinkOrder[1], color: "#FFFFFF"}}>
                            <p className="drinkSizeText">
                                {drinkSize ? drinkSize[0].toUpperCase() : null}
                            </p>
                            {hasIce && <img src="/images/ice.png" alt="Ice" className="Ice"/>}
                        </div>
                    </>)}
            </div>
        </div>
    );
}


export default CustomerOrder;
