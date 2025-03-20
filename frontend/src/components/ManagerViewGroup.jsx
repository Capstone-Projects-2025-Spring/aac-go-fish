import AACBoard from "./AACBoard";
import CustomerOrder from "./CustomerOrder";
import "./ManagerViewGroup.css";
import React from "react";
import ManagerActions from "./ManagerActions";
import MiniOrderDisplay from "./MiniOrderDisplay";

export default function ManagerViewGroup({
                                             selectedItems,
                                             onSelectItem,
                                             onDeleteItem,
                                             onClearAll,
                                             order,
                                             getOrder,
                                             handleSendItems,
                                             handleReceiveOrder,
                                             handleGiveToCustomer,
                                             burger,
                                             side,
                                             drink
                                         }) {
    return (<>
        <div className="columns">
            <div className="column">
                <AACBoard
                    selectedItems={selectedItems}
                    onSelectItem={onSelectItem}
                    onDeleteItem={onDeleteItem}
                    onClearAll={onClearAll}
                />
            </div>
            <div className="column">
                <CustomerOrder
                    order={order}
                    getOrder={getOrder}
                />
            </div>
        </div>
        <div className="columns">
            <div className="column">
                <ManagerActions
                    onSendItems={handleSendItems}
                    onReceiveOrder={handleReceiveOrder}
                    onGiveToCustomer={handleGiveToCustomer}
                />
            </div>
            <div className="column">
                <MiniOrderDisplay burger={burger} side={side} drink={drink}/>
            </div>
        </div>
    </>);
}
