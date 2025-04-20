import "./Modal.css"
import ReactDom from "react-dom"

export default function GameCompleteModal({ score, handleClick }) {
    return ReactDom.createPortal(<div className="modal-overlay">
        <div className="modal-content">
            <div className="text">🎉Day Complete!🎉</div>
            <div className="score-earned">${score}</div>
            <button onClick={handleClick()} className="home-button">
                ☀️ Next Day
            </button>
        </div>
    </div>, document.getElementById("portal"));
}
