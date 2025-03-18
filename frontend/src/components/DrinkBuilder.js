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
            <h1>Drink Station</h1>
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

            <div className="Cup">
                {layers.map((layer,index) =>(
                    <div
                        key = {index}
                        className="DrinkLayer"
                        style={{backgroundColor:layer.color}}
                    >
                    </div>
                ))}
                {hasIce && (
                    <img
                        src="/images/ice.png"
                        alt="Ice"
                        className="Ice"
                    />
                )}
            </div>
        </div>
    );
};

export default DrinkBuilder;
