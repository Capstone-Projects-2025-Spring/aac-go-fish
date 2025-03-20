export default function SelectedItemsDisplay({ selectedItems, onDelete, onClear }) {
    return (
        <div>
            {selectedItems.length === 0 ? (
                <p>Click an item to add it here!</p>
            ) : (
                <div className="aacboard-selected-items">
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
                    <div className="selected-items-actions">
                        <button onClick={onClear}>Clear All</button>
                    </div>
                </div>
            )}
        </div>
    );
}