import "./Modal.css"
import ReactDom from "react-dom"
import { playPopSound } from "../SoundEffects/playPopSound";

export default function StationStartModal({ stationName, handleClick }) {
    return ReactDom.createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="station-text">🧑‍🍳 {stationName} Station 👩‍🍳</div>
                <div className="station-sub-text">Let’s get started!</div>
                <button
                    onClick={() => {
                        handleClick();
                        playPopSound();
                    }}
                    className="home-button"
                >
                    👍 Start
                </button>
            </div>
        </div>,
        document.getElementById("portal-station")
    );
}
