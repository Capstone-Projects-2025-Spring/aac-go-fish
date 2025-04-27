
import "./AACBoard.css";
import ItemGrid from "./ItemGrid";
import SelectedItemsDisplay from "./SelectedItemsDisplay";
import { menu } from "../../menuItems";
function AACBoard({
    selectedItems,
    onSelectItem,
    onDeleteItem,
    onClearAll,
    onPlayAll,
}) {

    const handleClick = (item) => {
        if (item.audio) {
            const audio = new Audio(item.audio);
            audio.play().catch((err) => {
                console.error('Audio playback failed:', err);
            });
        }
        onSelectItem(item);
    };

    return (
        <>
            <SelectedItemsDisplay
                selectedItems={selectedItems}
                onDelete={onDeleteItem}
                onClear={onClearAll}
                onPlayAll={onPlayAll}
            />
            <ItemGrid items={menu} onClick={handleClick} />
        </>
    );
}

export default AACBoard;
