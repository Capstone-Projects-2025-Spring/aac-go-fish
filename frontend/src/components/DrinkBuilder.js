import React, { useState, useRef, useEffect } from 'react';
import "./DrinkBuilder.css"
import DrinkDisplay from "./DrinkDisplay";
const DrinkBuilder = ({ onSend }) =>{
    const [color, setColor] = useState([]);
    const [fillPercentage, setFillPercentage] = useState(0);
    const fillInterval = useRef(null);
    const [hasIce, setHasIce] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [colorSelected, setColorSelected] = useState(false);
    const [cupSize, setCupSize] = useState("medium");
    const [confirmMessage, setConfirmMessage] = useState("");
    const [cupPlaced, setCupPlaced] = useState(false);
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
    const fillRate = 200;

    useEffect(() => {
        setColor(null);
        setColorSelected(false);
        setFillPercentage(0);
    }, []);

    const startFilling = () => {
        if (!color || !cupPlaced) {
            return;
        }

        fillInterval.current = setInterval(() => {
            setFillPercentage((prev) => {
                if (prev >= maxFill){
                    clearInterval(fillInterval.current);
                    return maxFill;
                }
                return prev + fillAmount;
            });
        }, fillRate);
    };

    const stopFilling = () => {
        if (fillInterval.current) {
            clearInterval(fillInterval.current);
        }
    };

    const clearCup = () =>{
        setColor(null);
        setFillPercentage(0);
        setColorSelected(false);
        setCupPlaced(false);
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
        setConfirmMessage("Drink sent to manager!");
        setTimeout(() => {
            setConfirmMessage("");
        }, 3000);
    };

    const selectColor = (selectedColor) => {
        if (fillPercentage > 0){
            return;
        }
        setColor(selectedColor);
        setColorSelected(true);
    };

    const selectCupSize = (size) => {
        if (fillPercentage > 0){
            return;
        }
        setCupSize(size);
        setCupPlaced(true);
    };

    return (
        <div className="DrinkBuilder">
            <div className="DrinkButtons">
                {drinkColors.map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => selectColor(choice.color)}
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
                ))}
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
                        <img src="/images/MediumButton.png" alt="Small Cup" className="CupSizeImageMedium"/>
                    </button>
                    <button
                        className="CupSizeButtons"
                        onClick={() => selectCupSize("large")}
                        disabled={fillPercentage > 0}
                    >
                        <img src="/images/LargeButton.png" alt="Small Cup" className="CupSizeImageLarge"/>
                    </button>
                </div>
                <div className="DrinkDisplayContainer">
                    {cupPlaced && <DrinkDisplay color={color} fillPercentage={fillPercentage} cupSize={cupSize}/>}
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
            <div className="ConfirmMessage">
                {confirmMessage && <p>{confirmMessage}</p>}
            </div>
        </div>
    );
};

export default DrinkBuilder;
