import React from 'react';
import "./AACBoard.css";
import ItemGrid from "./ItemGrid";
import SelectedItemsDisplay from "../SelectedItemsDisplay";
import {menu} from "../menuItems";

function AACBoard({
    onItemClick,
    selectedItems,
    onSelectItem,
    onDeleteItem,
    onClearAll
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

    const handlePlayAll = async () => {
        for (const item of selectedItems) {
            if (item.audio) {
                const audio = new Audio(item.audio);
                await new Promise((resolve) => {
                    audio.onended = resolve;
                    audio.onerror = resolve;
                    audio.play().catch((err) => {
                        console.error('Audio playback failed:', err);
                        resolve();
                    });
                });
            }
        }
    }

    return (
        <div>
            <SelectedItemsDisplay selectedItems={selectedItems} onDelete={onDeleteItem} onClear={onClearAll}/>
            <ItemGrid items={menu} onClick={handleClick}/>
        </div>
    );
}

export default AACBoard;
