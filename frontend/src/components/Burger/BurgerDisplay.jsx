import React from "react";
import "./BurgerBuilder";

export default function BurgerDisplay({ imagePaths }) {
    return (
        <div className="BurgerDisplay">
            {imagePaths.map((path, idx) => (
                <img
                    key={idx}
                    className="IngredientOnGrill"
                    src={path}
                    alt={`ingredient-${idx}`}
                    style={{ zIndex: idx + 1 }}
                />
            ))}
        </div>
    );
}
