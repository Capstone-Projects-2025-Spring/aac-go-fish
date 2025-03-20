import React from 'react';
import "./AACBoard.css";

function AACBoard({
    onItemClick,
    selectedItems,
    onSelectItem,
    onDeleteItem,
    onClearAll
}) {
    //hard coding here for now, should be in its own file later
    //images from https://www.opensymbols.org/
    const foodItems = [
        { id: 1, name: 'Burger', image: '/images/burger.png', audio: '/audio/burger.mp3' },
        { id: 2, name: 'Bottom Bun', image: '/images/bottom_bun.png', audio: '/audio/bottom_bun.mp3' },
        { id: 3, name: 'Top Bun', image: '/images/top_bun.png', audio: '/audio/top_bun.mp3' },
        { id: 4, name: 'Patty', image: '/images/patty.png', audio: '/audio/patty.mp3' },
        { id: 6, name: 'Lettuce', image: '/images/lettuce.png', audio: '/audio/lettuce.mp3' },
        { id: 7, name: 'Onion', image: '/images/onion.png', audio: '/audio/onion.mp3' },
        { id: 8, name: 'Tomato', image: '/images/tomato.png', audio: '/audio/tomato.mp3' },
        { id: 9, name: 'Ketchup', image: '/images/ketchup.png', audio: '/audio/ketchup.mp3' },
        { id: 10, name: 'Mustard', image: '/images/mustard.png', audio: '/audio/mustard.mp3' },
        { id: 11, name: 'Cheese', image: '/images/cheese.png', audio: '/audio/cheese.mp3' },
    ];

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
                                onClick={() => onDeleteItem(index)}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <div className="selected-items-actions">
                        <button onClick={onClearAll}>Clear All</button>
                    </div>
                </div>
            )}

            <div className="aacboard-grid">
                {foodItems.map((item) => (

                    <button
                        key={item.id}
                        className="aacboard-item-btn"
                        onClick={() => handleClick(item)}
                    >
                        {item.image && (

                            <img src={item.image} alt={item.name} />
                        )}
                        <span>{item.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AACBoard;
