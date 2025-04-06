import { React, useContext }  from 'react';
import "./ManagerActions.css";

function ManagerActions({ onGiveToCustomer }) {
    return (
        <div className="ManagerActions">
            <button className="SendOrder" onClick={onGiveToCustomer}>
                <img className="SendCustomerOrder" src="/images/send_order.png" alt="send customer order" />
            </button>
        </div>
    );
}

export default ManagerActions;
