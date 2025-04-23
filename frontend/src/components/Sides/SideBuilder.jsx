import React, { useState, useRef, useContext } from "react";
import "./SideBuilder.css";
import SideDisplay from "./SideDisplay";
import { WebSocketContext } from "../../WebSocketContext";
import { playSendSound } from "../SoundEffects/playSendSound";
import { playPopSound } from "../SoundEffects/playPopSound";
import Score from "../Score/Score";

const RAW_STATES = ["potatoes", "onions", "cheese"];
const SIDE_TYPES = [
    { type: "potatoes", initialState: "potatoes", choppedState: "choppedPotatoes", finalState: "fries" },
    { type: "onions", initialState: "onions", choppedState: "choppedOnions", finalState: "onionRings" },
    { type: "cheese", initialState: "cheese", choppedState: "choppedCheese", finalState: "mozzarellaSticks" }
];

const SideBuilder = ({ score, day }) => {
    const [tableState, setTableState] = useState("empty");
    const [sideType, setSideType] = useState("");
    const [fryTimeLeft, setFryTimeLeft] = useState(0);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [isCutting, setIsCutting] = useState(false);
    const fryingIntervalRef = useRef(null);
    const { send } = useContext(WebSocketContext);

    const placeSide = (raw) => {
        if (tableState !== "empty") return;
        const side = SIDE_TYPES.find((s) => s.type === raw);
        if (side) {
            setTableState(side.initialState);
            setSideType(side.finalState);
        }
    };

    const chopSide = () => {
        const side = SIDE_TYPES.find((s) => s.initialState === tableState);
        if (!side) return;
        setIsCutting(true);
        new Audio("/audio/chopping.mp3").play();
        setTimeout(() => {
            setTableState(side.choppedState);
            setIsCutting(false);
        }, 2000);
    };

    const startFrying = (finalState) => {
        setTableState("frying");
        setFryTimeLeft(5);
        if (fryingIntervalRef.current) clearInterval(fryingIntervalRef.current);
        fryingIntervalRef.current = setInterval(() => {
            setFryTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(fryingIntervalRef.current);
                    fryingIntervalRef.current = null;
                    setTableState(finalState);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    const reset = () => {
        setTableState("empty");
        setFryTimeLeft(0);
        if (fryingIntervalRef.current) clearInterval(fryingIntervalRef.current);
    };

    const sendSide = () => {
        if (tableState === "empty" || tableState === "frying") return;
        send({
            data: {
                type: "game_state",
                game_state_update_type: "order_component",
                component_type: "side",
                component: { table_state: tableState }
            }
        });
        playSendSound();
        reset();
        setConfirmMessage("Side sent to manager!");
        setTimeout(() => setConfirmMessage(""), 3000);
    };

    const onDragStart = (e, item) => e.dataTransfer.setData("item", item);
    const allowDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("drop-hover");
    };
    const clearHover = (e) => e.currentTarget.classList.remove("drop-hover");

    const onTableDrop = (e) => {
        e.preventDefault();
        clearHover(e);
        const item = e.dataTransfer.getData("item");
        if (item === "knife") chopSide();
        else if (RAW_STATES.includes(item)) placeSide(item);
    };

    const onKnifeDrop = (e) => {
        e.preventDefault();
        clearHover(e);
        chopSide();
    };

    const onFryerDrop = (e) => {
        e.preventDefault();
        clearHover(e);
        const item = e.dataTransfer.getData("item");
        const side = SIDE_TYPES.find((s) => s.choppedState === item);
        if (side) {
            new Audio("/audio/frying.mp3").play();
            startFrying(side.finalState);
        }
    };

    const playHelpMessage = () => new Audio("/audio/side_help.mp3").play();
    const playRepeat = () => new Audio("/audio/repeat_order.mp3").play();

    const overlayImage =
        sideType === "fries"
            ? "/images/station_specific/choppedPotatoes.png"
            : sideType === "onionRings"
                ? "/images/food_side_view/sliced_onion.png"
                : sideType === "mozzarellaSticks"
                    ? "/images/food_side_view/SlicedMozzarella.png"
                    : null;

    return (
        <div className="SideBuilder">
            <div className="TopMenuSides">
                <button className="HelpButton" onClick={() => {playPopSound(); playHelpMessage()}}>
                    Help
                </button>
                <Score score={score} day={day} />
            </div>

            <div className="MainContainer2">
                <div className="LeftColumn">
                    {RAW_STATES.map((raw) => (
                        <button
                            key={raw}
                            className="LeftButtons"
                            disabled={tableState !== "empty"}
                            onClick={() => {
                                placeSide(raw);
                                playPopSound();
                                new Audio(`/audio/${raw}.mp3`).play();
                            }}
                            draggable
                            onDragStart={(e) => onDragStart(e, raw)}
                        >
                            <img
                                src={
                                    raw === "potatoes"
                                        ? "/images/station_specific/potatoButton.png"
                                        : raw === "onions"
                                            ? "/images/aac_icons/onion.png"
                                            : "/images/food_side_view/Mozzarella.png"
                                }
                                alt={raw}
                                className={`ButtonImages ${raw}-img`}
                            />

                            {raw.charAt(0).toUpperCase() + raw.slice(1)}
                        </button>
                    ))}
                </div>

                <div
                    className={`TableBorder ${isCutting ? "cutting" : ""}`}
                    draggable={tableState !== "empty" && tableState !== "frying"}
                    onDragStart={(e) => onDragStart(e, tableState)}
                    onDragOver={allowDrop}
                    onDrop={onTableDrop}
                    onDragLeave={clearHover}
                >
                    <SideDisplay tableState={tableState} fryTimeLeft={fryTimeLeft} onDragStart={onDragStart} />
                </div>

                <div className="RightColumn">
                    <button
                        className="RightButtons"
                        disabled={!RAW_STATES.includes(tableState)}
                        draggable
                        onDragStart={(e) => onDragStart(e, "knife")}
                        onDragOver={allowDrop}
                        onDrop={onKnifeDrop}
                        onDragLeave={clearHover}
                        onClick={chopSide}
                    >
                        <img src="/images/station_specific/knife.png" alt="knife" className="ButtonImages" />
                        Chop
                    </button>

                    <button
                        className="RightButtons"
                        onDragOver={allowDrop}
                        onDragLeave={clearHover}
                        onDrop={(e) => {
                            e.preventDefault();
                            clearHover(e);
                            reset();
                            playPopSound();
                        }}
                        onClick={() => {
                            reset();
                            playPopSound();
                        }}
                    >
                        <img src="/images/button_icons/clear_plate.png" alt="reset" className="ResetImage" />
                        Reset
                    </button>

                    <button
                        className="SendButton"
                        disabled={tableState === "empty" || tableState === "frying"}
                        onDragOver={allowDrop}
                        onDragLeave={clearHover}
                        onDrop={(e) => {
                            e.preventDefault();
                            clearHover(e);
                            if (tableState !== "empty" && tableState !== "frying") {
                                playPopSound();
                                sendSide();
                            }
                        }}
                        onClick={() => {
                            playPopSound();
                            sendSide();
                        }}
                    >
                        <img src="/images/button_icons/bag.png" alt="send" className="SendImg" />
                        Send
                    </button>

                    <button className="RightButtons" onClick={() => {playPopSound(); playRepeat()}}>
                        <img src="/images/button_icons/repeat_order.png" className="RepeatOrderImage" alt="Repeat" />
                        Repeat Order
                    </button>
                </div>
            </div>

            <div
                className={`Fryer ${tableState === "frying" ? "frying" : ""}`}
                onDragOver={allowDrop}
                onDrop={onFryerDrop}
                onDragLeave={clearHover}
            >
                <img src="/images/station_specific/fryer.png" alt="Fryer" className="FryerImage" />
                {tableState === "frying" && overlayImage && <img src={overlayImage} alt="" className="ChoppedOverlay" />}
            </div>

            {confirmMessage && (
                <div className="ConfirmMessage">
                    <p>{confirmMessage}</p>
                </div>
            )}
        </div>
    );
};

export default SideBuilder;
