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
                <button onClick={onSendItems} >
                    Send Items
                </button>
                <button onClick={onReceiveOrder}>
                    Receive Order
                </button>
                <button onClick={onGiveToCustomer}>
                    Give to Customer
                </button>
            </div>
        </div>
    );
}

export default ManagerActions;
