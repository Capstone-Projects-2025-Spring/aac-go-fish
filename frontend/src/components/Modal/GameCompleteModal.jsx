import "./Modal.css"
import ReactDom from "react-dom"
import {playPopSound} from "../SoundEffects/playPopSound";

export default function GameCompleteModal({ score }) {
    return ReactDom.createPortal(<div className="overlay">
        <div className="modal-content">
            <div className="text">🎉Great Job!🎉</div>
            <div className="score-earned">{score}</div>
            <button onClick={() => {playPopSound(); window.location.href = "/"}} className="home-button">
                🏠 Back to home
            </button>
        </div>
    </div>, document.getElementById("portal-game"));
}
