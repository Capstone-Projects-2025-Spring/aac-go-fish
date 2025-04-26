import React, { useContext, useState, useEffect } from 'react';
import './BurgerBuilder.css';
import BurgerStation from "./BurgerStation";
import { menu } from "../../menuItems";
import { WebSocketContext } from "../../WebSocketContext";
import { playSendSound } from "../SoundEffects/playSendSound";
import { playPopSound } from "../SoundEffects/playPopSound";
import Score from "../Score/Score";
import StationStartModal from "../Modal/StationStartModal";
import Tutorial from "../Modal/Tutorial";

const BurgerBuilder = ({ score, day }) => {
    const [ingredients, setIngredients] = useState([]);
    const { send } = useContext(WebSocketContext);
    const [fullMessage, setFullMessage] = useState("");
    const [showStart, setShowStart] = useState(true);

    const foodItems = menu[0].children;

    const handleStart = () => {
        setShowStart(false);
    };

    useEffect(() => {
        if (showStart) {
            const timer = setTimeout(() => {
                handleStart();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [showStart]);

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
            setFullMessage("");
            playPopSound();
            const audio = new Audio(ingredient.audio);
            audio.play();
        } else {
            setFullMessage("Plate is Full!");
        }
    };

    const removeIngredient = () => {
        setIngredients(prevIngredients => {
            if (prevIngredients.length === 0) {
                return prevIngredients;
            }
            return prevIngredients.slice(0, -1);
        });
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
        <>
            {showStart && (
                <StationStartModal
                    stationName="Burger"
                    handleClick={handleStart}
                />
            )}

            {!showStart && (
                <Tutorial
                    classNames={[
                        "IngredientButtons",
                        "SendOrderButton",
                    ]}
                    audioSourceFolder={"/audio/tutorial/burger"}
                />
            )}

            <div className="BurgerBuilder">
                <div className="TopMenuBurger">
                    <button className="HelpButton" onClick={() => { playPopSound(); }}>
                        Help
                    </button>
                    <Score score={score} day={day} />
                </div>

                <div className="IngredientButtons">
                    {foodItems.map((ingredient, index) => (
                        <button key={index} onClick={() => addIngredient(ingredient)}>
                            <img src={ingredient.image} alt={ingredient.name} className="IngredientImage" />
                            <p>{ingredient.name}</p>
                        </button>
                    ))}
                </div>

                <BurgerStation imagePaths={ingredients.map((ingredient) => ingredient.sideImage)} />

                <button
                    className="BottomButtons"
                    onClick={() => { removeIngredient(); playPopSound(); }}
                    disabled={ingredients.length === 0}
                >
                    <img src="/images/button_icons/undo.png" alt="Undo" className="UndoImage" />
                    <p>Undo</p>
                </button>

                <button
                    className="ClearPlateButton"
                    onClick={() => { clearPlate(); playPopSound(); }}
                    disabled={ingredients.length === 0}
                >
                    <img src="/images/button_icons/clear_plate.png" alt="Clear Plate" className="ClearPlateImage" />
                    <p>Delete Burger</p>
                </button>

                <button
                    className="BottomButtons"
                    onClick={() => { playPopSound(); handleRequestRepeat(); }}
                >
                    <img src="/images/button_icons/repeat_order.png" className="RepeatOrderImage" alt="Repeat" />
                    <p>Repeat Order</p>
                </button>

                <button
                    onClick={() => { handleSend(); playPopSound(); }}
                    className="SendOrderButton"
                >
                    <img src="/images/button_icons/send_order.png" alt="Send Order" className="SendCustomerOrderImage" />
                </button>

                <div className="ErrorMessage">
                    {fullMessage && <p>{fullMessage}</p>}
                </div>
            </div>
        </>
    );
};

export default BurgerBuilder;
