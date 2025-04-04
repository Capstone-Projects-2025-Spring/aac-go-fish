import React from 'react';
import "./ManagerActions.css";

function ManagerActions({ onGiveToCustomer }) {

    return (
        <button className="SendOrder" onClick={onGiveToCustomer}>
            <img className="SendCustomerOrder" src="/images/send_order.png" alt="send customer order" />
        </button>
    );
}

export default ManagerActions;
