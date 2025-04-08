import React from "react";
import "./BurgerBuilder";

export default function BurgerDisplay({ imagePaths }) {
    return (
        <div className="BurgerDisplay">
            {imagePaths.map((path, idx) => {
                const ingredientType = path.split("/").pop().split(".")[0];
                return (
                    <img
                        key={idx}
                        className={`IngredientOnGrill ${ingredientType}-Ingredient`}
                        src={path}
                        alt={`ingredient-${idx}`}
                        style={{zIndex: idx + 1}}
                    />
                );
            })}
        </div>
    );
}
