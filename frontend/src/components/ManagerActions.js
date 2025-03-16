import React from 'react';
import "./ManagerActions.css";

function ManagerActions({
    actionLog,
    onSendItems,
    onReceiveOrder,
    onGiveToCustomer
}) {

    return (
        <div className="manager-actions-container">
            <h3>Text Based Manager Actions</h3>
            <p>Select an action (test)</p>

            <div className="manager-actions-buttons">
                <button onClick={onSendItems} style={{ marginRight: '0.5rem' }}>
                    Send Items
                </button>
                <button onClick={onReceiveOrder} style={{ marginRight: '0.5rem' }}>
                    Receive Order
                </button>
                <button onClick={onGiveToCustomer}>
                    Give to Customer
                </button>
            </div>

            <div className="manager-action-log">
                <h4>Action Log</h4>
                {actionLog.length === 0 ? (
                    <p>No actions yet...</p>
                ) : (
                    actionLog.map((entry, idx) => (
                        <div key={idx} style={{ marginBottom: '0.25rem' }}>
                            {entry}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ManagerActions;
