import React, { useContext, useState } from 'react';
import './BurgerBuilder.css';
import BurgerStation from "./BurgerStation";
import { menu } from "../../menuItems";
import { WebSocketContext } from "../../WebSocketContext";
import { playSendSound } from "../Manager/playSendSound";
import Score from "../Score/Score";

const BurgerBuilder = ({ score, day }) => {
    const [ingredients, setIngredients] = useState([]);
    const { send } = useContext(WebSocketContext);

    const foodItems = menu[0].children;

    const handleSend = () => {
        const employeeOrder = ingredients.map(ingredient => ingredient.name);
        send({
            data: {
                type: "game_state",
                game_state_update_type: "order_component",
                component_type: "burger",
                component: {
                    ingredients: employeeOrder,
                }
            }
        });
        playSendSound();
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
            <Score score={score} day={day} />
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
                <img src="/images/button_icons/clear_plate.png" alt="Clear Plate" className="ClearPlateImage" />
            </button>
            <button className="BottomButtons" onClick={handleRequestRepeat}>
                <img src="/images/button_icons/repeat_order.png" alt="Request Repeat" className="RepeatOrderImage" />
            </button>
            <button onClick={handleSend} className="SendOrderButton">
                <img src="/images/button_icons/send_order.png" alt="Send Order" className="SendCustomerOrderImage" />
            </button>
        </div>
    );
};

export default BurgerBuilder;
