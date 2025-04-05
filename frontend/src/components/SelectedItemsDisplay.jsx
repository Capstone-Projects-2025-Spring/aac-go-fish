import "./SelectedItemsDisplay.css";

export default function SelectedItemsDisplay({selectedItems, onDelete, onClear, onPlayAll}) {
    return (<div className="aacboard-selected-items">
        <div>
            {selectedItems.map((item, index) => (
                <span key={index} className="aacboard-selected-item">
                    {item.image && (<img src={item.image} alt={item.name}/>)}
                    {item.name}
                <button
                    className="selected-item-delete"
                    onClick={() => onDelete(index)}
                >
                    ×
                </button>
                </span>
            ))}
        </div>
        {selectedItems.length !== 0 && <div>
            <button className="selected-items-actions" onClick={onClear}>Clear All</button>
            <button className="selected-items-actions" onClick={onPlayAll}>Play All</button>
        </div>}
    </div>);
}
