import React from 'react';
import "./ManagerActions.css";

function ManagerActions({
    onReceiveOrder,
    onGiveToCustomer
}) {

    return (
        <div className="manager-actions-container">
            <p>Select an action</p>
            <div className="manager-actions-buttons">
                <button className="MenuButtons" onClick={onReceiveOrder}>
                    Receive Order
                </button>
                <button className="SendOrder" onClick={onGiveToCustomer}>
                    <img className="SendCustomerOrder" src="images/send_order.png" alt="send customer order" />
                </button>
            </div>
        </div>
    );
}

export default ManagerActions;
