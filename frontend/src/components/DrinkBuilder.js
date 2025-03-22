import React, { useState, useRef } from 'react';
import "./DrinkBuilder.css"
import DrinkDisplay from "./DrinkDisplay";
const DrinkBuilder = ({ onSend }) =>{
    const [color, setColor] = useState([]);
    const [fillPercentage, setFillPercentage] = useState(0);
    const fillInterval = useRef(null);
    const [hasIce, setHasIce] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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

    const startFilling = () => {
        if (!color) {
            setErrorMessage("Select a color!");
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
        });
        clearCup();
    };

    return (
        <div className = "DrinkBuilder">
            <div className="DrinkButtons">
                {drinkColors.map((choice, index) => (
                    <button
                        key = {index}
                        onClick={() => setColor(choice.color)}
                        style={{
                            backgroundColor: choice.color,
                            color: "#FFFFFF",
                            border: color === choice.color ? "3px solid black" : "none",
                        }}
                    >
                        {choice.name}
                    </button>
                    ))}
            </div>

            <button className="FillCupButton"
                    onMouseDown={startFilling}
                    onMouseUp={stopFilling}
                    onMouseLeave={stopFilling}
            >
                Fill Cup
            </button>

            <button className="ClearCupButton" onClick = {clearCup}>
                Clear Cup
            </button>
            <DrinkDisplay color={color} fillPercentage={fillPercentage}/>
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default DrinkBuilder;
