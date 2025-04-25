import React, { useState, useRef, useEffect, useContext } from 'react';
import "./DrinkBuilder.css";
import DrinkDisplay from "./DrinkDisplay.jsx";
import { WebSocketContext } from "../../WebSocketContext";
import { playSendSound } from "../SoundEffects/playSendSound";
import Score from "../Score/Score";
import {playPopSound} from "../SoundEffects/playPopSound";
import Tutorial from "../Modal/Tutorial";

const DrinkBuilder = ({ score, day }) => {
    const [color, setColor] = useState([]);
    const [fillPercentage, setFillPercentage] = useState(0);
    const fillInterval = useRef(null);
    const [colorSelected, setColorSelected] = useState(false);
    const [cupSize, setCupSize] = useState("medium");
    const [confirmMessage, setConfirmMessage] = useState("");
    const [cupPlaced, setCupPlaced] = useState(false);
    const [cupPosition, setCupPosition] = useState(0);

    const drinkColors = [
        { name: "Blue", color: "#34C6F4" },
        { name: "Green", color: "#99CA3C" },
        { name: "Yellow", color: "#e2d700" },
        { name: "Red", color: "#FF0000" },
        { name: "Orange", color: "#F5841F" },
        { name: "Purple", color: "#7E69AF" },
    ];
    const { send } = useContext(WebSocketContext);
    const maxFill = 100;
    const fillAmount = 5;
    const fillRate = 175;

    useEffect(() => {
        setColor(null);
        setColorSelected(false);
        setFillPercentage(0);
    }, []);

    const startFilling = () => {
        if (!color || !cupPlaced) return;

        const fillingSound = playFillingSound();
        fillInterval.current = setInterval(() => {
            setFillPercentage(prev => {
                if (prev >= maxFill) {
                    clearInterval(fillInterval.current);
                    fillingSound.pause();
                    return maxFill;
                }
                return prev + fillAmount;
            });
        }, fillRate);
        fillInterval.sound = fillingSound;
    };

    const stopFilling = () => {
        if (fillInterval.current) clearInterval(fillInterval.current);
        if (fillInterval.sound) fillInterval.sound.pause();
    };

    const clearCup = () => {
        setColor(null);
        setFillPercentage(0);
        setColorSelected(false);
        setCupPlaced(false);
        setCupPosition(0);
    };

    const handleSend = () => {
        send({
            data: {
                type: "game_state",
                game_state_update_type: "order_component",
                component_type: "drink",
                component: {
                    color: color,
                    fill: fillPercentage,
                    size: cupSize,
                }
            }
        });
        clearCup();
        playSendSound();
        setConfirmMessage("Drink sent to manager!");
        setTimeout(() => setConfirmMessage(""), 3000);
    };

    const selectColor = (selectedColor) => {
        if (fillPercentage > 0) return;

        const selectedDrink = drinkColors.find(drink => drink.color === selectedColor);
        const selectedName = selectedDrink ? selectedDrink.name : "";

        setColor("");
        setTimeout(() => setColor(selectedColor), 50);
        setColorSelected(true);
        playPopSound();
        const audio = new Audio(`/audio/${selectedName.toLowerCase()}.mp3`);
        audio.play();
    };

    const selectCupSize = (size) => {
        if (fillPercentage > 0) return;

        setCupSize(size);
        setCupPlaced(true);
        playPopSound();
            const audio = new Audio(`/audio/${size.toLowerCase()}.mp3`);
            audio.play();
    };

    const playFillingSound = () => {
        const audio = new Audio("/audio/filling.mp3");
        audio.loop = true;
        audio.play();
        return audio;
    };

    const handleRequestRepeat = () => {
        console.log("Employee requests manager to repeat order...");
        const audio = new Audio("/audio/repeat_order.mp3");
        audio.play().catch((err) => {
            console.error("Audio playback failed:", err);
        });
    };


    return (
        <div className="DrinkBuilder">
            <Tutorial
                classNames={[
                    "CupSizeContainer",
                    "DrinkButtonsContainer",
                    "FillCupButton",
                    "SendButton",
                ]}
                audioSourceFolder={"/audio/tutorial/drink"}
            />
            <div className="TopMenuDrink">
                <Score score={score} day={day}/>
            </div>
            <div className="DrinkButtonsContainer">
                {drinkColors.map((choice, index) => (
                    <div className="DrinkButtons" key={index}>
                        <button
                            onClick={() => {
                                selectColor(choice.color);
                                setCupPosition(-375 + index * 150);
                            }}
                            style={{
                                backgroundColor: choice.color,
                                color: "#FFFFFF",
                                border: color === choice.color ? "3px solid black" : "none",
                                WebkitTextStroke: "",
                            }}
                            disabled={fillPercentage > 0}
                        >
                            {choice.name}
                        </button>
                        <img src="/images/station_specific/Dispenser.png" alt="Dispenser" className="DispenserImage" />
                    </div>
                ))}
            </div>
            <div className="MainContainer">
                <div className="CupSizeContainer">
                    <button
                        className="CupSizeButtons"
                        onClick={() => selectCupSize("small")}
                        disabled={fillPercentage > 0}
                    >
                        <img src="/images/button_icons/SmallButton.png" alt="Small Cup" className="CupSizeImageSmall" />
                    </button>
                    <button
                        className="CupSizeButtons"
                        onClick={() => selectCupSize("medium")}
                        disabled={fillPercentage > 0}
                    >
                        <img src="/images/button_icons/MediumButton.png" alt="Medium Cup" className="CupSizeImageMedium" />
                    </button>
                    <button
                        className="CupSizeButtons"
                        onClick={() => selectCupSize("large")}
                        disabled={fillPercentage > 0}
                    >
                        <img src="/images/button_icons/LargeButton.png" alt="Large Cup" className="CupSizeImageLarge" />
                    </button>
                </div>
                <div className="DrinkDisplayContainer">
                    {cupPlaced && (
                        <DrinkDisplay
                            color={color}
                            fillPercentage={fillPercentage}
                            cupSize={cupSize}
                            cupPosition={cupPosition}
                        />
                    )}
                    <div className="ConfirmMessage">
                        {confirmMessage && <p>{confirmMessage}</p>}
                    </div>
                </div>
                <div className="ActionButtonsContainer">
                    <button className="ClearCupButton" onClick={() => {clearCup(); playPopSound()}}>
                        <img src="/images/button_icons/clear_plate.png" alt="Clear Side" className="ClearSideImage" />
                        <p>Clear Cup</p>
                    </button>
                    <button
                        className="FillCupButton"
                        onMouseDown={startFilling}
                        onMouseUp={stopFilling}
                        onMouseLeave={stopFilling}
                        disabled={!cupPlaced || !colorSelected}
                        title="Press and hold to fill"
                    >
                        <img src="/images/button_icons/pouring.png" alt="Fill Cup" className="FillCupImage" />
                        <p>Fill Cup</p>

                    </button>
                    <button className="SendButton" onClick={() => {handleSend(); playPopSound()}}>Send</button>
                    <button className="BottomButtons" onClick={() => {playPopSound(); handleRequestRepeat()}}>
                        <img src="/images/button_icons/repeat_order.png" className="RepeatOrderImage" />
                        <p>Repeat Order</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DrinkBuilder;
