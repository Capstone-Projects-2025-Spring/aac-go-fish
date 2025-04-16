import "./GameCompleteModal.css"
import ReactDom from "react-dom"

export default function GameCompleteModal({ dollarsEarned, onClose }) {
    return ReactDom.createPortal(<div className="modal-overlay">
        <div className="modal-content">
            {`Game complete!\nYou earned $${dollarsEarned}`}
            <button onClick={onClose}/>
        </div>
    </div>, document.getElementById("portal"));
}
