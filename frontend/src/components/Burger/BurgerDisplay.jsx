import React from "react";
import "./BurgerBuilder";

export default function BurgerDisplay({ imagePaths }) {
    return (
        <div className="BurgerDisplay">
            {imagePaths.map((path, idx) => {
                const ingredientName = path.split("/").pop().replace("_side.png","");
                return (
                    <img
                        key={idx}
                        className={`IngredientOnGrill ${ingredientName}-Ingredient`}
                        src={path}
                        alt={ingredientName}
                        style={{zIndex: idx + 1}}
                    />
                );
            })}
        </div>
    );
}
