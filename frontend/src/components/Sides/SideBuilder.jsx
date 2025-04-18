import React, { useState, useRef, useContext } from 'react';
import "./SideBuilder.css";
import SideDisplay from "./SideDisplay";
import { WebSocketContext } from "../../WebSocketContext";
import { playSendSound } from "../Manager/playSendSound";
import Score from "../Score/Score";

const SideBuilder = ({ score, day }) => {
    const [tableState, setTableState] = useState("empty");
    const [fryTimeLeft, setFryTimeLeft] = useState(0);
    const fryingIntervalRef = useRef(null);
    const [sideType, setSideType] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");
    const { send } = useContext(WebSocketContext);

    const sideTypes = [
        { type: "potatoes", initialState: "potatoes", choppedState: "choppedPotatoes", finalState: "fries" },
        { type: "onions", initialState: "onions", choppedState: "choppedOnions", finalState: "onionRings" },
        { type: "cheese", initialState: "cheese", choppedState: "choppedCheese", finalState: "mozzarellaSticks" },
    ];

    const handleSend = () => {
        send({
            data: {
                type: "game_state",
                game_state_update_type: "order_component",
                component_type: "side",
                component: {
                    table_state: tableState,
                }
            }
        });
        playSendSound();
        reset();
        setConfirmMessage("Side sent to manager!");
        setTimeout(() => {
            setConfirmMessage("");
        }, 3000);
    };

    const placeSide = (type) => {
        if (tableState === "empty") {
            const side = sideTypes.find((side) => side.type === type);
            if (side) {
                setTableState(side.initialState);
                setSideType(side.finalState);
            }
        }
    };

    const chopSide = () => {
        playChoppingSound();
        const side = sideTypes.find((side) => side.initialState === tableState);
        if (side) {
            setTimeout(() => {
                setTableState(side.choppedState);
            }, 2000);

        }
    };

    const startFrying = (finalState) => {
        setTableState("frying");
        let timeLeft = 5;
        setFryTimeLeft(timeLeft);

        if (fryingIntervalRef.current) {
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
        if (fryingIntervalRef.current) {
            clearInterval(fryingIntervalRef.current);
            fryingIntervalRef.current = null;
        }
    };

    const handleDragStart = (event, itemType) => {
        event.dataTransfer.setData("itemType", itemType);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.currentTarget.classList.add("drop-hover");
    };

    const handleDragLeave = (event) => {
        event.currentTarget.classList.remove("drop-hover");
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove("drop-hover");

        const itemType = event.dataTransfer.getData("itemType");
        const side = sideTypes.find((side) => side.choppedState === itemType);
        if (side) {
            playFryingSound();
            startFrying(side.finalState);
        }
    };

    const getOverlayImage = () => {
        if (sideType === "fries") {
            return <img src="/images/station_specific/choppedPotatoes.png" alt="Chopped Potatoes" className="ChoppedOverlay" />;
        }
        if (sideType === "onionRings") {
            return <img src="/images/food_side_view/onion_side.png" alt="Chopped Onions" className="ChoppedOverlay" />;
        }
        if (sideType === "mozzarellaSticks") {
            return <img src="/images/food_side_view/cheese_side.png" alt="Chopped Cheese" className="ChoppedOverlay" />;
        }
        return null;
    }

    const playFryingSound = () => {
        const audio = new Audio("/audio/frying.mp3");
        audio.play();
    }

    const playChoppingSound = () => {
        const audio = new Audio("/audio/chopping.mp3");
        audio.play();
    }

    const handleRequestRepeat = () => {
        console.log("Employee requests manager to repeat order...");
        const audio = new Audio("/audio/repeat_order.mp3");
        audio.play().catch((err) => {
            console.error("Audio playback failed:", err);
        });
    };

    return (
        <div className="SideBuilder">
            <Score score={score} day={day} />
            <div className="MainContainer2">
                <div className="LeftColumn">
                    <button className="LeftButtons" onClick={() => placeSide("potatoes")}
                        disabled={tableState !== "empty"}>
                        <img src="/images/station_specific/potatoButton.png" alt="Place Potatoes" className="ButtonImages" />
                        Potato
                    </button>
                    <button className="LeftButtons" onClick={() => placeSide("onions")}
                        disabled={tableState !== "empty"}>
                        <img src="/images/aac_icons/onion.png" alt="Place Onions" className="ButtonImages" />
                        Onion
                    </button>
                    <button className="LeftButtons" onClick={() => placeSide("cheese")}
                        disabled={tableState !== "empty"}>
                        <img src="/images/aac_icons/cheese.png" alt="Place Cheese" className="ButtonImages" />
                        Cheese
                    </button>
                </div>
                <div className="TableBorder">
                    <SideDisplay tableState={tableState} fryTimeLeft={fryTimeLeft} onDragStart={handleDragStart} />
                </div>
                <div className="RightColumn">
                    <button className="RightButtons" onClick={chopSide}
                        disabled={tableState !== "potatoes" && tableState !== "onions" && tableState !== "cheese"}>
                        <img src="/images/station_specific/knife.png" alt="" className='ButtonImages' />
                        Chop
                    </button>
                    <button className="RightButtons" onClick={reset}>
                        <img src="/images/button_icons/clear_plate.png" alt="Chop Potatoes" className="ResetImage" />
                        Reset
                    </button>
                    <button className="SendButton" onClick={handleSend}
                        disabled={tableState === "empty" || tableState === "frying"}>Send
                    </button>
                    <button className="RightButtons" onClick={handleRequestRepeat}>
                        <img src="/images/button_icons/repeat_order.png" className="RepeatOrderImage" />
                        <p>Repeat Order</p>
                    </button>
                </div>
            </div>

            <div className={`Fryer ${tableState === "frying" ? "frying" : ""}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
            >
                <img src="/images/station_specific/fryer.png" alt="Fryer" className="FryerImage" />
                {tableState === "frying" && getOverlayImage()}
            </div>
            <div className="ConfirmMessage">
                {confirmMessage && <p>{confirmMessage}</p>}
            </div>
        </div>
    );
};

export default SideBuilder;
