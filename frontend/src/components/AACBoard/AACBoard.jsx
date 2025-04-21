
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
    return (
        <>
            <ItemGrid items={menu} onClick={onSelectItem} />
            <SelectedItemsDisplay
                selectedItems={selectedItems}
                onDelete={onDeleteItem}
                onClear={onClearAll}
                onPlayAll={onPlayAll}
            />
        </>
    );
}

export default AACBoard;
