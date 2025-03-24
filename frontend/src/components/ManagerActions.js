import React from 'react';
import "./ManagerActions.css";

function ManagerActions({
    onSendItems,
    onReceiveOrder,
    onGiveToCustomer
}) {

    return (
        <div className="manager-actions-container">
            <p>Select an action (test)</p>

            <div className="manager-actions-buttons">
                <button className="MenuButtons" onClick={onSendItems} >
                    Send Items
                </button>
                <button className="MenuButtons" onClick={onReceiveOrder}>
                    Receive Order
                </button>
                <button className="MenuButtons" onClick={onGiveToCustomer}>
                    Give to Customer
                </button>
            </div>
        </div>
    );
}

export default ManagerActions;
