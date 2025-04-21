
import "./AACBoard.css";
import ItemGrid from "./ItemGrid";
import SelectedItemsDisplay from "./SelectedItemsDisplay";
import {useState} from "react";
function AACBoard() {
    const [selectedItems, setSelectedItems] = useState([]);
    const addItem = (item) => setSelectedItems((prev) => [...prev, item]);
    const clearAll = () => setSelectedItems([]);
    const playAll = async () => {
        if (selectedItems.length === 0) return;
        for (const item of selectedItems) {
            if (item.audio) {
                const audio = new Audio(item.audio);
                await new Promise((resolve) => {
                    audio.play().then(() => {
                        audio.onended = resolve;
                    }).catch(resolve);
                });
            }
        }
    };

    return (
        <>
            <ItemGrid onClick={addItem} />
            <SelectedItemsDisplay selectedItems={selectedItems} onClear={clearAll} onPlay={playAll}/>
        </>
    );
}

export default AACBoard;
