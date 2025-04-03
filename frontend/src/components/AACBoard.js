import React, { useState } from 'react';
import "./AACBoard.css";
import ItemGrid from "./ItemGrid";
import SelectedItemsDisplay from "./SelectedItemsDisplay";
import { menu } from "../menuItems";

function AACBoard({
    onItemClick,
    selectedItems,
    onSelectItem,
    onDeleteItem,
    onClearAll,
    onPlayAll,
    customerImage,
    burgerOrder,
    drinkOrder,
    hasSide,
    hasIce,
    drinkSize,
    orderVisible,
}) {
    const [shiftDown, setShiftDown] = useState(false);

    const handleClick = (item) => {
        const name = item.name.toLowerCase();
        if (name === "burger" || name === "drink") {
            setShiftDown(true);
        } else if (name === "back") {
            setShiftDown(false);
        }

        if (item.audio) {
            const audio = new Audio(item.audio);
            audio.play().catch((err) => {
                console.error('Audio playback failed:', err);
            });
        }

        onSelectItem(item);
        if (onItemClick) {
            onItemClick(item.name);
        }
    };

    return (
        <div className="AACBoardContainer">
            <SelectedItemsDisplay
                selectedItems={selectedItems}
                onDelete={onDeleteItem}
                onClear={onClearAll}
                onPlayAll={onPlayAll}
            />
            <ItemGrid items={menu} onClick={handleClick} />

            <div className={`imageAndOrder ${shiftDown ? "shiftDown" : ""}`}>
                <img
                    src={customerImage ?? "/images/customers/empty.png"}
                    alt="Customer"
                    className="manager-image top-left-customer"
                />
            </div>

        </div>
    );
}

export default AACBoard;
