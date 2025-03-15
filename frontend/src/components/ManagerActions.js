import React, { useState } from 'react';

function ManagerActions() {
    const [actionLog, setActionLog] = useState([]);

    const handleSendItems = () => {
        setActionLog((prev) => [...prev, 'Manager: Sending items...']);
    };

    const handleReceiveOrder = () => {
        setActionLog((prev) => [...prev, 'Manager: Receiving the order...']);
    };

    const handleGiveToCustomer = () => {
        setActionLog((prev) => [...prev, 'Manager: Giving items to the customer...']);
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', maxWidth: '500px' }}>
            <h3>Text Based Manager Actions</h3>
            <p>Select an action (test)</p>

            <div style={{ marginBottom: '1rem' }}>
                <button onClick={handleSendItems} style={{ marginRight: '0.5rem' }}>
                    Send Items
                </button>
                <button onClick={handleReceiveOrder} style={{ marginRight: '0.5rem' }}>
                    Receive Order
                </button>
                <button onClick={handleGiveToCustomer}>
                    Give to Customer
                </button>
            </div>

            <div style={{ background: '#f9f9f9', minHeight: '80px', padding: '0.5rem' }}>
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
