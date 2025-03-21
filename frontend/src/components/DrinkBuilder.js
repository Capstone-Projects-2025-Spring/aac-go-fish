import React, { useState } from 'react';
import "./DrinkBuilder.css"
const DrinkBuilder = ({
    hasIce,
    layers,
    addLayer,
    changeIce,
    clearCup
}) =>{

    const drinkLayers = [
        {name: "Blue", color: "#0033CC"},
        {name: "Green", color: "#00CC00"},
        {name: "Yellow", color: "#FFFF00"},
        {name: "Red", color: "#FF0000"},
        {name: "Orange", color: "#FF9900"},
        {name: "Purple", color: "#660099"},
    ];



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
