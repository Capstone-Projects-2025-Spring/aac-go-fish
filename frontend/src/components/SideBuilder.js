import React, { useState, useRef } from 'react';
import "./SideBuilder.css"
import SideDisplay from "./SideDisplay";

const SideBuilder = ({ onSend }) =>{
    const [tableState, setTableState] = useState("empty");
    const [fryTimeLeft, setFryTimeLeft] = useState(0);
    const fryingIntervalRef = useRef(null);
    const [sideType, setSideType] = useState("");

    const handleSend = () => {
        onSend({
            tableState,
            fryTimeLeft,
        });
        reset();
    };

    const placeSide = (type) => {
        if (tableState === "empty"){
            setTableState(type === "potatoes" ? "potatoes" : "onions");
            setSideType(type === "potatoes" ? "fries" : "onionRings")
        }
    };

    const chopSide = () =>{
        if (tableState === "potatoes") {
            setTableState("choppedPotatoes");
        }
        if (tableState === "onions") {
            setTableState("choppedOnions");
        }
    };

    const frySide = () => {
        if (tableState === "choppedPotatoes") {
            setTableState("frying");
            let timeLeft = 5;
            setFryTimeLeft(timeLeft)

            if (fryingIntervalRef.current){
                clearInterval(fryingIntervalRef.current);
            }

            fryingIntervalRef.current = setInterval(() => {
                setFryTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(fryingIntervalRef.current);
                        fryingIntervalRef.current = null;
                        setTableState("fries");
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        else if (tableState === "choppedOnions") {
            setTableState("frying");
            let timeLeft = 5;
            setFryTimeLeft(timeLeft)

            if (fryingIntervalRef.current){
                clearInterval(fryingIntervalRef.current);
            }

            fryingIntervalRef.current = setInterval(() => {
                setFryTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(fryingIntervalRef.current);
                        fryingIntervalRef.current = null;
                        setTableState("onionRings");
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
    };

    const reset = () => {
        setTableState("empty");
        setFryTimeLeft(0);
        if (fryingIntervalRef.current){
            clearInterval(fryingIntervalRef.current);
            fryingIntervalRef.current = null;
        }
    };

    return (
        <div className="SideBuilder">
            <div className="TableBorder">
                <SideDisplay tableState={tableState} fryTimeLeft={fryTimeLeft}/>
            </div>
            <div className="SideButtons">
                <button onClick={() => placeSide("potatoes")} disabled={tableState !== "empty"}>
                    <img src="/images/potatoButton.png" alt="Place Potatoes" className="ButtonImages"/>
                    Place Potatoes
                </button>
                <button onClick={() => placeSide("onions")} disabled={tableState !== "empty"}>
                    <img src="/images/onion.png" alt="Place Onions" className="ButtonImages"/>
                    Place Onions
                </button>
                <button onClick={chopSide} disabled={tableState !== "potatoes" && tableState !== "onions"}>
                    <img src="/images/knife.png" alt="Chop Potatoes" className="ButtonImages"/>
                    Chop
                </button>
                <button onClick={frySide} disabled={tableState !== "choppedPotatoes" && tableState !== "choppedOnions"}>
                    <img src="/images/fryer.png" alt="Fry Potatoes" className="ButtonImages"/>
                    Fry
                </button>
                <button onClick={reset}>
                    Reset
                </button>
            </div>
            <button className="SendButton" onClick={handleSend}>Send</button>
        </div>
    );
};

export default SideBuilder;
