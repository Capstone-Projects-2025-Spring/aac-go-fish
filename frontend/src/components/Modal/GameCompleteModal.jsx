import "./Modal.css"
import ReactDom from "react-dom"

export default function GameCompleteModal({ score }) {
    return ReactDom.createPortal(<div className="modal-overlay">
        <div className="modal-content">
            <div className="text">🎉Great Job!🎉</div>
            <div className="score-earned">{score}</div>
            <button onClick={() => window.location.href = "/"} className="home-button">
                🏠 Back to home
            </button>
        </div>
    </div>, document.getElementById("portal"));
}
