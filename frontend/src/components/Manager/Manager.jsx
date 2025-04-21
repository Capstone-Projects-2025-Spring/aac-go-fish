import MiniOrderDisplay from "./MiniOrderDisplay";
import AACBoard from "../AACBoard/AACBoard";
import React, {useContext} from "react";
import {WebSocketContext} from "../../WebSocketContext";
import "./Manager.css"


export default function Manager({customerIndex, customerOrder, employeeOrder, setEmployeeOrder}) {
    const {send} = useContext(WebSocketContext);

    const handleGiveToCustomer = () => {
        send({
            data: {
                type: "game_state", game_state_update_type: "order_submission", order: {
                    burger: {
                        ingredients: employeeOrder.burger
                    }, drink: employeeOrder.drink, side: employeeOrder.side,
                }
            }
        });
        setEmployeeOrder(null);
    };

    return <>
        <img
            className="customer"
            src={`images/customers/${customerIndex}.png`}
            alt={`Customer ${customerIndex}`}
        />
        <MiniOrderDisplay burger={customerOrder.burger} drink={customerOrder.drink} side={customerOrder.side}/>
        <MiniOrderDisplay burger={employeeOrder.burger} drink={employeeOrder.drink} side={employeeOrder.side}/>
        <AACBoard/>
        <button className="send-order" onClick={handleGiveToCustomer}>
            Send Order
        </button>
    </>
}