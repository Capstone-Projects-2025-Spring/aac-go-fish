import React from "react";
import "./BurgerBuilder";

function BurgerDisplay({ imagePaths }) {
    return (
        <div className="BurgerDisplay">
            <img
                className="GrillImage"
                src="/images/kitchen.png"
                alt="grill station"
            />

            <div className="BurgerStack">
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
        </div>
    );
}

export default BurgerDisplay;
