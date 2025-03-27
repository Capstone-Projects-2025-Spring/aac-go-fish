import React from 'react';
import "./ManagerActions.css";

function ManagerActions({
    onGiveToCustomer
}) {

    return (
        <div className="manager-actions-container">
            <p>Select an action (test)</p>
            <div className="manager-actions-buttons">
                <button className="MenuButtons" onClick={onGiveToCustomer}>
                    Give to Customer
                </button>
            </div>
        </div>
    );
}

export default ManagerActions;
