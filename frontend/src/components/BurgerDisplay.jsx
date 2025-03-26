import React from "react";
import "./BurgerBuilder";

function BurgerDisplay({ imagePaths }) {
    return (
        <div className="BurgerDisplay">
            <img
                src="/images/kitchen.png"
                alt="Grill Station"
                className="GrillImage"
            />

            {imagePaths.map((path, idx) => (
                <img
                    key={idx}
                    src={path}
                    alt={`ingredient-${idx}`}
                    className="IngredientOnGrill"
                />
            ))}
        </div>
    );
}

export default BurgerDisplay;
