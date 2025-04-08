import React from "react";
import "./BurgerBuilder";

export default function BurgerDisplay({ imagePaths }) {
    return (
        <div className="BurgerDisplay">
            {imagePaths.map((path, idx) => {
                const isCheese = path.includes("cheese");
                return (
                    <img
                        key={idx}
                        className={`IngredientOnGrill ${isCheese ? "CheeseIngredient" : ""}`}
                        src={path}
                        alt={`ingredient-${idx}`}
                        style={{zIndex: idx + 1}}
                    />
                );
            })}
        </div>
    );
}
