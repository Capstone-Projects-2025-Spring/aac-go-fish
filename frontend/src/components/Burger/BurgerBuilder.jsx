import React, {useContext, useState} from 'react';
import './BurgerBuilder.css';
import BurgerStation from "./BurgerStation";
import {menu} from "../../menuItems";
import {WebSocketContext} from "../../WebSocketContext";
import {playSendSound} from "../SoundEffects/playSendSound";
import {SoundButton} from "../Employee/SoundButton";

const BurgerBuilder = () => {
    const [ingredients, setIngredients] = useState([]);
    const {send} = useContext(WebSocketContext);
    const [fullMessage, setFullMessage] = useState("");

    const foodItems = menu[0].children;

    const handleSend = () => {
        const employeeOrder = ingredients.map(ingredient => ingredient.name);
        send({
            data: {
                type: "game_state", game_state_update_type: "order_component", component_type: "burger", component: {
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
            setFullMessage("");
            setTimeout(() => {
                const audio = new Audio(ingredient.audio);
                audio.play();
            }, 750);

        } else {
            setFullMessage("Plate is Full!");
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

    const playHelpMessage = () => {
        const audio = new Audio("/audio/burger_help.mp3");
        audio.play();
    }

    return (<div className="BurgerBuilder">
            <div className="TopMenuBurger">
                <button className="HelpButton" onClick={playHelpMessage}>
                    Help
                </button>
            </div>
            <div className="IngredientButtons">
                {foodItems.map((ingredient, index) => (<SoundButton key={index} onClick={() => addIngredient(ingredient)}>
                        <img src={ingredient.image} alt={ingredient.name} className="IngredientImage"/>
                        <p>{ingredient.name}</p>
                    </SoundButton>))}
            </div>
            <BurgerStation imagePaths={ingredients.map((ingredient) => ingredient.sideImage)}/>
            <SoundButton className="ClearPlateButton" onClick={() => {
                clearPlate();
            }}>
                <img src="/images/button_icons/clear_plate.png" alt="Clear Plate" className="ClearPlateImage"/>
                <p>Delete Burger</p>
            </SoundButton>
            <button className="BottomButtons" onClick={handleRequestRepeat}>
                <img src="/images/button_icons/repeat_order.png" className="RepeatOrderImage"/>
                <p>Repeat Order</p>
            </button>

            <button onClick={handleSend} className="SendOrderButton">
                <img src="/images/button_icons/send_order.png" alt="Send Order" className="SendCustomerOrderImage"/>
            </button>
            <div className="ErrorMessage">
                {fullMessage && <p>{fullMessage}</p>}
            </div>
        </div>);
};

export default BurgerBuilder;
