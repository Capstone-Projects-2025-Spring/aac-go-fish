import React from 'react';
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
}) {

    const handleClick = (item) => {
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
        <div>
            <SelectedItemsDisplay selectedItems={selectedItems} onDelete={onDeleteItem} onClear={onClearAll} onPlayAll={onPlayAll} />
            <ItemGrid items={menu} onClick={handleClick} />
            <img
                src={customerImage ?? "/images/customers/empty.png"}
                alt="Customer"
                className="manager-image"
            />
        </div>
    );
}

export default AACBoard;
