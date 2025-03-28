import React, { useState, useRef } from 'react';
import "./SideBuilder.css"
import SideDisplay from "./SideDisplay";

const SideBuilder = ({ onSend }) =>{
    const [tableState, setTableState] = useState("empty");
    const [fryTimeLeft, setFryTimeLeft] = useState(0);
    const fryingIntervalRef = useRef(null);
    const [sideType, setSideType] = useState("");

    const sideTypes = [
        {type: "potatoes", initialState: "potatoes", choppedState: "choppedPotatoes", finalState: "fries"},
        {type: "onions", initialState: "onions", choppedState: "choppedOnions", finalState: "onionRings"},
    ];

    const handleSend = () => {
        onSend({
            tableState,
            fryTimeLeft,
        });
        reset();
    };

    const placeSide = (type) => {
        if (tableState === "empty"){
            const side = sideTypes.find((side) => side.type === type);
            if (side) {
                setTableState(side.initialState);
                setSideType(side.finalState);
            }
        }
    };

    const chopSide = () =>{
        const side = sideTypes.find((side) => side.initialState === tableState);
        if (side) {
            setTableState(side.choppedState);
        }
    };

    const startFrying = (finalState) => {
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
                    setTableState(finalState);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }

    const reset = () => {
        setTableState("empty");
        setFryTimeLeft(0);
        if (fryingIntervalRef.current){
            clearInterval(fryingIntervalRef.current);
            fryingIntervalRef.current = null;
        }
    };

    const handleDragStart = (event, itemType) =>{
        event.dataTransfer.setData("itemType",itemType);
    }

    const handleDrop = (event) => {
        event.preventDefault();
        const itemType = event.dataTransfer.getData("itemType");
        const side = sideTypes.find((side) => side.choppedState === itemType);
        if (side) {
            startFrying(side.finalState);
        }
    };

    const getOverlayImage = () => {
        if (sideType === "fries"){
            return <img src="/images/choppedPotatoes.png" alt="Chopped Potatoes" className="ChoppedOverlay" />;
        }
        if (sideType === "onionRings"){
            return <img src="/images/OnionSide.png" alt="Chopped Onions" className="ChoppedOverlay" />;
        }
        return null;
    }

    return (
        <div className="SideBuilder">
                <div className="TableBorder">
                    <SideDisplay tableState={tableState} fryTimeLeft={fryTimeLeft} onDragStart={handleDragStart}/>
                </div>
                <div className={`Fryer ${tableState === "frying" ? "frying" : ""}`}
                     onDragOver={(event)=> event.preventDefault()}
                     onDrop={handleDrop}
                >
                    <img src="/images/fryer.png" alt="Fryer" className="FryerImage" />
                    {tableState === "frying" && getOverlayImage()}
                </div>
            <div className="SideButtons">
                <button onClick={() => placeSide("potatoes")} disabled={tableState !== "empty"}>
                    <img src="/images/potatoButton.png" alt="Place Potatoes" className="ButtonImages"/>
                    Potato
                </button>
                <button onClick={() => placeSide("onions")} disabled={tableState !== "empty"}>
                    <img src="/images/onion.png" alt="Place Onions" className="ButtonImages"/>
                    Onion
                </button>
                <button onClick={chopSide} disabled={tableState !== "potatoes" && tableState !== "onions"}>
                    <img src="/images/knife.png" alt="Chop Potatoes" className="ButtonImages"/>
                    Chop
                </button>
                <button onClick={reset}>
                    Reset
                </button>
            </div>
            <button className="SendButton" onClick={handleSend} disabled={tableState === "empty" || tableState === "frying"}>Send</button>
        </div>
    );
};

export default SideBuilder;
