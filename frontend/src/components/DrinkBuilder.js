import React, { useState, useRef, useEffect } from 'react';
import "./DrinkBuilder.css"
import DrinkDisplay from "./DrinkDisplay";
export const drinkColors = [
    {name: "Blue", color: "#34C6F4"},
    {name: "Green", color: "#99CA3C"},
    {name: "Yellow", color: "#F7EC13"},
    {name: "Red", color: "#FF0000"},
    {name: "Orange", color: "#F5841F"},
    {name: "Purple", color: "#7E69AF"},
];
const DrinkBuilder = ({ onSend }) =>{
    const [color, setColor] = useState([]);
    const [fillPercentage, setFillPercentage] = useState(0);
    const fillInterval = useRef(null);
    const [hasIce, setHasIce] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [colorSelected, setColorSelected] = useState(false);
    const [cupSize, setCupSize] = useState("medium");

    const maxFill = 100;
    const fillAmount = 5;
    const fillRate = 200;

    useEffect(() => {
        setColor(null);
        setColorSelected(false);
        setFillPercentage(0);
    }, []);

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
        setColorSelected(false);
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
    };

    const selectColor = (selectedColor) => {
        if (color != null){
            return;
        }
        setColor(selectedColor);
        setColorSelected(true);
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
                        disabled={colorSelected}
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

            <button className="ClearCupButton" onClick={clearCup}>
                Clear Cup
            </button>
            <button
                className="CupSizeButtons"
                onClick={() => setCupSize("small")}
            >
                Small
            </button>
            <button
                className="CupSizeButtons"
                onClick={() => setCupSize("medium")}
            >
                Medium
            </button>
            <button
                className="CupSizeButtons"
                onClick={() => setCupSize("large")}
            >
                Large
            </button>
            <DrinkDisplay color={color} fillPercentage={fillPercentage} cupSize ={cupSize}/>
            <button className ="SendButton" onClick={handleSend}>Send</button>
        </div>
    );
};

export default DrinkBuilder;
