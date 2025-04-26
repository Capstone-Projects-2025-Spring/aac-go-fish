import "./Modal.css"
import React, { useEffect } from "react"
import ReactDom from "react-dom"
import { playPopSound } from "../SoundEffects/playPopSound"

export default function DayCompleteModal({ score, customers, handleClick }) {
    useEffect(() => {
        new Audio("/audio/next_day.mp3").play().catch(() => {})
    }, [])

    return ReactDom.createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="text">🎉Day Complete!🎉</div>
                <div className="customers">
                    {customers == 1 ? "1 Happy Customer!" : customers + " Happy Customers!"}
                </div>
                <div className="score-earned">{score}</div>
                <button
                    onClick={() => {
                        handleClick()
                        playPopSound()
                    }}
                    className="home-button"
                >
                    ☀️ Next Day
                </button>
            </div>
        </div>,
        document.getElementById("portal-day")
    )
}
