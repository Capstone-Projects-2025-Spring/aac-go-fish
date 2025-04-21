import "./AACBoard.css";


export default function SelectedItemsDisplay({ selectedItems, onClear, onPlay }) {
    return <div className="aacboard-selected-items">
        {selectedItems.slice(0, 15).map((item) =>
            item.image && <img src={item.image} alt={item.name} />
        )}
        {selectedItems.length !== 0 && <>
            <button onClick={onPlay}>Play All</button>
            <button onClick={onClear}>Clear All</button>
        </>}
    </div>;
}
