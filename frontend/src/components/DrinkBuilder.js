import React, { useState } from 'react';
import "./DrinkBuilder.css"
import DrinkDisplay from "./DrinkDisplay";
const DrinkBuilder = ({ onSend }) =>{
    const [layers, setLayers] = useState([]);
    const [hasIce, setHasIce] = useState(false);
    const drinkLayers = [
        {name: "Blue", color: "#0033CC"},
        {name: "Green", color: "#00CC00"},
        {name: "Yellow", color: "#FFFF00"},
        {name: "Red", color: "#FF0000"},
        {name: "Orange", color: "#FF9900"},
        {name: "Purple", color: "#660099"},
    ];

    const handleSend = () => {
        onSend({
            layers,
            hasIce,
        });
        clearCup();
    };

    const maxSize = 9;

    const addLayer = (layer) =>{
        if (layers.length <= maxSize){
            setLayers([...layers, layer]);
        }
        else{
            alert("Cup is full!");
        }

    };

    const changeIce = () =>{
        setHasIce(!hasIce);
    };

    const clearCup = () =>{
        setLayers([]);
        setHasIce(false);
    };

    return (
        <div className = "DrinkBuilder">
            <div className="DrinkButtons">
                {drinkLayers.map((choice, index) => (
                    <button
                        key = {index}
                        onClick={() => addLayer(choice)}
                        style={{backgroundColor: choice.color, color: "#FFFFFF"}}
                    >
                        {choice.name}
                    </button>
                    ))}
            </div>
            <button className="AddIceButton" onClick = {changeIce}>
                {hasIce ? "Remove Ice" : "Add Ice"}
            </button>

            <button className="ClearCupButton" onClick = {clearCup}>
                Clear Cup
            </button>
            <DrinkDisplay layers={layers} hasIce={hasIce}/>
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default DrinkBuilder;
