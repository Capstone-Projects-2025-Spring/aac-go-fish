import "./GameCompleteModal.css"
import ReactDom from "react-dom"

export default function GameCompleteModal({ score }) {
    return ReactDom.createPortal(<div className="modal-overlay">
        <div className="modal-content">
            {`Game complete!\nYou earned $${score}`}
            <button onClick={() => window.location.reload()}>Back to lobby</button>
        </div>
    </div>, document.getElementById("portal"));
}
