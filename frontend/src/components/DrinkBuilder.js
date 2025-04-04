import React, { useState, useRef, useEffect } from 'react';
import "./DrinkBuilder.css";
import DrinkDisplay from "./DrinkDisplay";
import { playSendSound } from "./playSendSound";

const DrinkBuilder = ({
    onSend,
    score
}) =>{
    const [color, setColor] = useState([]);
    const [fillPercentage, setFillPercentage] = useState(0);
    const fillInterval = useRef(null);
    const [hasIce, setHasIce] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [colorSelected, setColorSelected] = useState(false);
    const [cupSize, setCupSize] = useState("medium");
    const [confirmMessage, setConfirmMessage] = useState("");
    const [cupPlaced, setCupPlaced] = useState(false);
    const [cupPosition, setCupPosition] = useState(0);
    const drinkColors = [
        {name: "Blue", color: "#34C6F4"},
        {name: "Green", color: "#99CA3C"},
        {name: "Yellow", color: "#F7EC13"},
        {name: "Red", color: "#FF0000"},
        {name: "Orange", color: "#F5841F"},
        {name: "Purple", color: "#7E69AF"},
    ];
    const maxFill = 100;
    const fillAmount = 5;
    const fillRate = 175;

    useEffect(() => {
        setColor(null);
        setColorSelected(false);
        setFillPercentage(0);
    }, []);

    const startFilling = () => {
        if (!color || !cupPlaced) {
            return;
        }

        const fillingSound = playFillingSound();

        fillInterval.current = setInterval(() => {
            setFillPercentage((prev) => {
                if (prev >= maxFill){
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
        if (fillInterval.current) {
            clearInterval(fillInterval.current);
        }
        if (fillInterval.sound) {
            fillInterval.sound.pause();
        }
    };

    const clearCup = () =>{
        setColor(null);
        setFillPercentage(0);
        setColorSelected(false);
        setCupPlaced(false);
        setCupPosition(0);
    };

    const handleSend = () => {
        if (!color || fillPercentage === 0){
            setErrorMessage("Cup is empty!");
            return;
        }

        onSend({
            color,
            fillPercentage,
            hasIce,
            cupSize,
        });
        clearCup();
        playSendSound();
        setConfirmMessage("Drink sent to manager!");
        setTimeout(() => {
            setConfirmMessage("");
        }, 3000);
    };

    const selectColor = (selectedColor) => {
        if (fillPercentage > 0){
            return;
        }
        setColor("");
        setTimeout(() => {
            setColor(selectedColor);
        }, 50);
        setColorSelected(true);
    };

    const selectCupSize = (size) => {
        if (fillPercentage > 0){
            return;
        }
        setCupSize(size);
        setCupPlaced(true);
    };

    const playFillingSound = () => {
        const audio = new Audio("/audio/filling.mp3");
        audio.loop = true;
        audio.play();
        return audio;
    }

    return (
        <div className="DrinkBuilder">
            <p className='ScoreText'>Your score is ${score}</p>
            <div className="DrinkButtons">
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
                                    WebkitTextStroke: "1px black",
                                }}
                                disabled={fillPercentage > 0}
                            >
                                {choice.name}
                            </button>
                            <img src="/images/Dispenser.png" alt="Dispenser" className="DispenserImage"/>
                        </div>
                    ))}
                </div>
            </div>
            <div className="MainContainer">
                <div className="CupSizeContainer">
                    <button
                        className="CupSizeButtons"
                        onClick={() => selectCupSize("small")}
                        disabled={fillPercentage > 0}
                    >
                        <img src="/images/SmallButton.png" alt="Small Cup" className="CupSizeImageSmall"/>
                    </button>
                    <button
                        className="CupSizeButtons"
                        onClick={() => selectCupSize("medium")}
                        disabled={fillPercentage > 0}
                    >
                        <img src="/images/MediumButton.png" alt="Medium Cup" className="CupSizeImageMedium"/>
                    </button>
                    <button
                        className="CupSizeButtons"
                        onClick={() => selectCupSize("large")}
                        disabled={fillPercentage > 0}
                    >
                        <img src="/images/LargeButton.png" alt="Large Cup" className="CupSizeImageLarge"/>
                    </button>
                </div>
                <div className="DrinkDisplayContainer">
                    {cupPlaced && <DrinkDisplay color={color} fillPercentage={fillPercentage} cupSize={cupSize}
                                                cupPosition={cupPosition}/>}
                    <div className="ConfirmMessage">
                        {confirmMessage && <p>{confirmMessage}</p>}
                    </div>
                </div>
                <div className="ActionButtonsContainer">
                    <button className="ClearCupButton" onClick={clearCup}>
                        <img src="/images/undo.png" alt="Clear Cup" className="ClearCupImage"/>
                    </button>
                    <button className="FillCupButton"
                            onMouseDown={startFilling}
                            onMouseUp={stopFilling}
                            onMouseLeave={stopFilling}
                            disabled={!cupPlaced || !colorSelected}
                            title="Press and hold to fill"
                    >
                        <img src="/images/pouring.png" alt="Fill Cup" className="FillCupImage"/>
                    </button>
                    <button className="SendButton" onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default DrinkBuilder;
