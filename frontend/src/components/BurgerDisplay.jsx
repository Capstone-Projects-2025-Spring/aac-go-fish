import React from "react";
import "./BurgerBuilder.css"

export default function BurgerDisplay({ imagePaths }) {
    return (
        <div className="BurgerContainer">
            <div className="Burger">
                {imagePaths.map((imagePath, index) => (
                    <img
                        key={index}
                        src={imagePath}
                        alt={`Ingredient ${index}`}
                        className="BurgerIngredient"
                    />
                ))}
            </div>
            <div className="Plate" />
        </div>
    );
}
