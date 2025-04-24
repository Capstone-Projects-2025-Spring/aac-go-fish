import "./Modal.css"
import ReactDom from "react-dom"

export default function ErrorModal({ msg, handleClick }) {
    return ReactDom.createPortal(<div className="modal-overlay">
        <div className="modal-content">
            <div className="error-msg">{msg}</div>
            <button onClick={handleClick} className="home-button">
                👍 OK
            </button>
        </div>
    </div>, document.getElementById("portal-error"));
}
