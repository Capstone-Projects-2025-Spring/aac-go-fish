import "./SelectedItemsDisplay.css";

export default function SelectedItemsDisplay({ selectedItems, onDelete, onClear, onPlayAll }) {
    return (
        <div>
            {selectedItems.length === 0 ? (
                <p>Click an item to add it here!</p>
            ) : (
                <div className="aacboard-selected-items">
                    <div>
                    {selectedItems.map((item, index) => (
                        <span key={index} className="aacboard-selected-item">
                            {item.image && (
                                <img src={item.image} alt={item.name} />
                            )}
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

                <button className="selected-items-actions" onClick={onClear}>Clear All</button>
                <button className="selected-items-actions" onClick={onPlayAll}>Play All</button>
                </div>
            )}
        </div>
    );
}
