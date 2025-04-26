import "./Modal.css"
import React, { useEffect } from "react"
import ReactDom from "react-dom"
import { playPopSound } from "../SoundEffects/playPopSound";

export default function GameCompleteModal({ score }) {
    useEffect(() => {
        new Audio("/audio/game_end.mp3").play().catch(() => {})
    }, [])

    return ReactDom.createPortal(<div className="modal-overlay">
        <div className="modal-content">
            <div className="text">🎉Great Job!🎉</div>
            <div className="score-earned">{score}</div>
            <button onClick={() => { playPopSound(); window.location.href = "/" }} className="home-button">
                🏠 Back to home
            </button>
        </div>
    </div>, document.getElementById("portal-game"));
}
