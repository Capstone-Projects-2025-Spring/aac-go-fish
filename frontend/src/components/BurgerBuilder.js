import React, { useState } from 'react';
import './BurgerBuilder.css';
import BurgerStation from "./BurgerStation";
import {menu} from "../menuItems";
const BurgerBuilder = ({ onSend, score }) => {
    const [ingredients, setIngredients] = useState([]);

    const foodItems = menu[0].children;

    const handleSend = () => {
        onSend(ingredients.map(ingredient => ingredient.name));
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
            <p className='ScoreText'>Your score is ${score}</p>
            <div className="IngredientButtons">
                {foodItems.map((ingredient, index) => (
                    <button key={index} onClick={() => addIngredient(ingredient)}>
                        <img src={ingredient.image} alt={ingredient.name} className="IngredientImage" />
                        <p>{ingredient.name}</p>
                    </button>
                ))}
            </div>
            <BurgerStation imagePaths={ingredients.map((ingredient) => ingredient.sideImage)} />
            <button className="ClearPlateButton" onClick={clearPlate}>
                <img src="/images/clear_plate.png" alt="Clear Plate" className="ClearPlateImage" />
            </button>
            <button className="BottomButtons" onClick={handleRequestRepeat}>
                <img src="/images/repeat_order.png" alt="Request Repeat" className="RepeatOrderImage" />
            </button>
            <button onClick={handleSend} className="SendOrderButton">
                <img src="/images/send_order.png" alt="Send Order" className="SendCustomerOrderImage" />
            </button>
        </div>
    );
};

export default BurgerBuilder;
