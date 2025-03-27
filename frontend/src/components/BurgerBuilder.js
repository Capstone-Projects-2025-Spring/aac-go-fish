import React, { useState } from 'react';
import './BurgerBuilder.css';
import BurgerDisplay from "./BurgerDisplay";
import {menu} from "../menuItems";
const BurgerBuilder = ({ onSend }) => {
    const [ingredients, setIngredients] = useState([]);

    const foodItems = menu[0].children;

    const handleSend = () => {
        onSend(ingredients);
        clearPlate();
    };

    const maxSize = 9;

    const addIngredient = (ingredient) => {
        if (ingredients.length <= maxSize) {
            setIngredients([...ingredients, ingredient]);
        }
        else {
            alert("Plate is full!");
        }

    };
    const clearPlate = () => {
        setIngredients([]);
    };

    const handleRequestRepeat = () => {
        console.log("Employee requests manager to repeat order...");
        const audio = new Audio("/audio/repeat_order.mp3");
        audio.play().catch((err) => {
            console.error("Audio playback failed:", err);
        });
    };


    return (
        <div className="BurgerBuilder">
            <div className="IngredientButtons">
                {foodItems.map((ingredient, index) => (
                    <button key={index} onClick={() => addIngredient(ingredient)}>
                        <img src={ingredient.image} alt={ingredient.name} className="IngredientImage" />
                        <p>{ingredient.name}</p>
                    </button>
                ))}
            </div>
            <BurgerDisplay imagePaths={ingredients.map((ingredient) => ingredient.sideImage)} />
            <button className="ClearPlateButton" onClick={clearPlate}>
                Clear Plate
            </button>
            <button className="BottomButtons" onClick={handleSend}>Send</button>
            <button className="BottomButtons" onClick={handleRequestRepeat}>Request Repeat</button>
        </div>
    );
};

export default BurgerBuilder;
