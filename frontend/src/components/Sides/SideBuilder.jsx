import React, { useState, useRef, useContext } from 'react';
import "./SideBuilder.css";
import SideDisplay from "./SideDisplay";
import { WebSocketContext } from "../../WebSocketContext";
import { playSendSound } from "../Manager/playSendSound";
import Score from "../Score/Score";

const SideBuilder = ({ score, day }) => {
    const [tableState, setTableState] = useState("empty");
    const [fryTimeLeft, setFryTimeLeft] = useState(0);
    const [isCutting, setIsCutting] = useState(false);
    const fryingIntervalRef = useRef(null);
    const [sideType, setSideType] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");
    const { send } = useContext(WebSocketContext);

    const sideTypes = [
        { type: "potatoes", initialState: "potatoes", choppedState: "choppedPotatoes", finalState: "fries" },
        { type: "onions", initialState: "onions", choppedState: "choppedOnions", finalState: "onionRings" },
        { type: "cheese", initialState: "cheese", choppedState: "choppedCheese", finalState: "mozzarellaSticks" },
    ];
    const RAW_STATES = ["potatoes", "onions", "cheese"];
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
        setIsCutting(true);
        playChoppingSound();
        const side = sideTypes.find((s) => s.initialState === tableState);
        if (side) {
            setTimeout(() => {
                setTableState(side.choppedState);
                setIsCutting(false);
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

    const handleTableDrop = (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove("drop-hover");

        const itemType = event.dataTransfer.getData("itemType");

        if (itemType === "knife") {
            chopSide();
            return;
        }

        if (itemType === "knife") {
            chopSide();
        } else if (RAW_STATES.includes(itemType) && tableState === "empty") {
            placeSide(itemType);
        }
    };
    const handleKnifeDrop = (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove("drop-hover");
        const itemType = event.dataTransfer.getData("itemType");
        if (RAW_STATES.includes(itemType)) {
            chopSide();
        }
    };


    const handleDragOver = (event) => {
        event.preventDefault();
        event.currentTarget.classList.add("drop-hover");
    };

    const handleDragLeave = (event) => {
        event.currentTarget.classList.remove("drop-hover");
    };

    const handleFryerDrop = (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove("drop-hover");

        const itemType = event.dataTransfer.getData("itemType");
        const side = sideTypes.find((side) => side.choppedState === itemType);
        if (side) {
            playFryingSound();
            startFrying(side.finalState);
        }
    };

    const handleResetDrop = (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove("drop-hover");
        reset();
    };

    const handleSendDrop = (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove("drop-hover");
        if (tableState !== "empty" && tableState !== "frying") {
            handleSend();
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
                    <button className="LeftButtons" draggable
                        onDragStart={(e) => handleDragStart(e, "potatoes")}>
                        <img src="/images/station_specific/potatoButton.png" alt="Place Potatoes" className="ButtonImages" />
                        Potato
                    </button>
                    <button className="LeftButtons" draggable
                        onDragStart={(e) => handleDragStart(e, "onions")}>
                        <img src="/images/aac_icons/onion.png" alt="Place Onions" className="ButtonImages" />
                        Onion
                    </button>
                    <button className="LeftButtons" draggable
                        onDragStart={(e) => handleDragStart(e, "cheese")}>
                        <img src="/images/aac_icons/cheese.png" alt="Place Cheese" className="ButtonImages" />
                        Cheese
                    </button>
                </div>
                <div
                    className={`TableBorder ${isCutting ? "cutting" : ""}`}
                    draggable={tableState !== "empty" && tableState !== "frying"}
                    onDragStart={(e) => handleDragStart(e, tableState)}
                    onDragOver={handleDragOver}
                    onDrop={handleTableDrop}
                    onDragLeave={handleDragLeave}
                >
                    <SideDisplay
                        tableState={tableState}
                        fryTimeLeft={fryTimeLeft}
                        onDragStart={handleDragStart}
                    />
                </div>

                <div className="RightColumn">

                    <button
                        className="RightButtons"
                        draggable
                        onDragStart={(e) => handleDragStart(e, "knife")}
                        onDragOver={handleDragOver}
                        onDrop={handleKnifeDrop}
                        onDragLeave={handleDragLeave}
                        onClick={chopSide}
                        disabled={!["potatoes", "onions", "cheese"].includes(tableState)}
                    >
                        <img src="/images/station_specific/knife.png" alt="" className="ButtonImages" />
                        Chop
                    </button>
                    <button className="RightButtons" onClick={reset} onDragOver={handleDragOver}
                        onDrop={handleResetDrop}
                        onDragLeave={handleDragLeave}>
                        <img src="/images/button_icons/clear_plate.png" alt="Chop Potatoes" className="ResetImage" />
                        Reset
                    </button>
                    <button
                        className="SendButton"
                        onClick={handleSend}
                        onDragOver={handleDragOver}
                        onDrop={handleSendDrop}
                        onDragLeave={handleDragLeave}
                        disabled={tableState === "empty" || tableState === "frying"}
                    >
                        <img src="/images/button_icons/bag.png" alt="Send order" className='SendImg' />
                        Send      </button>
                    <button className="RightButtons" onClick={handleRequestRepeat}>
                        <img src="/images/button_icons/repeat_order.png" className="RepeatOrderImage" />
                        <p>Repeat Order</p>
                    </button>
                </div>
            </div>

            <div className={`Fryer ${tableState === "frying" ? "frying" : ""}`}
                onDragOver={handleDragOver}
                onDrop={handleFryerDrop}
                onDragLeave={handleDragLeave}
            >
                <img src="/images/station_specific/fryer.png" alt="Fryer" className="FryerImage" />
                {tableState === "frying" && getOverlayImage()}
            </div>
            <div className="ConfirmMessage">
                {confirmMessage && <p>{confirmMessage}</p>}
            </div>
        </div >
    );
};

export default SideBuilder;
