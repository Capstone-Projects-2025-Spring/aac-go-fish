import React, { useState } from 'react';
import "./SideBuilder.css"

const SideBuilder = ({ onSend }) =>{
    const [tableState, setTableState] = useState("empty");
    const [fryTimeLeft, setFryTimeLeft] = useState(0);

    const handleSend = () => {
        onSend(null);
    };

    const placePotatoes = () =>{
        if (tableState === "empty") {
            setTableState("potatoes");
        }
    };

    const chopPotatoes = () =>{
        if (tableState === "potatoes"){
            setTableState("chopped");
        }
    };

    const fryPotatoes = () => {
        if (tableState === "chopped") {
            setTableState("frying");
            let timeLeft = 5;
            setFryTimeLeft(timeLeft)

            const fryingInterval = setInterval(() =>{
                timeLeft -= 1;
                setFryTimeLeft(timeLeft);
                if (timeLeft === 0){
                    clearInterval(fryingInterval);
                    setTableState("fries");
                }
            }, 1000);
        }
    };

    const reset = (fryingInterval) => {
        clearInterval(fryingInterval)
        setTableState("empty");
    }

    return (
        <div className="SideBuilder">
            <h1>Side Station</h1>
            <div className="Table">
                {tableState === "empty" && <p>Table is empty</p>}
                {tableState === "potatoes" && (<img src="/images/potato.png" alt="Potato" className="TableImages"/>)}
                {tableState === "chopped" && (
                    <img src="/images/choppedPotatoes.png" alt="ChoppedPotatoes" className="TableImages"/>)}
                {tableState === "frying" && (
                    <>
                        <img src="/images/fryer.png" alt="Frying" className="TableImages"/>
                        <p>Time left: {fryTimeLeft} seconds</p>
                    </>
                )}
                {tableState === "fries" && (<img src="/images/fries.png" alt="Fries" className="TableImages"/>)}
            </div>
            <div className="SideButtons">
                <button onClick={placePotatoes} disabled={tableState !== "empty"}>
                    <img src="/images/potatoButton.png" alt="Place Potatoes" className="ButtonImages"/>
                    Place Potatoes
                </button>
                <button onClick={chopPotatoes} disabled={tableState !== "potatoes"}>
                    <img src="/images/knife.png" alt="Chop Potatoes" className="ButtonImages"/>
                    Chop Potatoes
                </button>
                <button onClick={fryPotatoes} disabled={tableState !== "chopped"}>
                    <img src="/images/fryer.png" alt="Fry Potatoes" className="ButtonImages"/>
                    Fry Potatoes
                </button>
                <button onClick={reset}>
                    Reset
                </button>
            </div>
            <button onClick={handleSend} disabled={tableState !== "fries"}>Send</button>
        </div>
    );
};

export default SideBuilder;
