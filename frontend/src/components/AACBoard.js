import React, { useState, useEffect } from 'react';
import "./AACBoard.css";
import ItemGrid from "./ItemGrid";
import SelectedItemsDisplay from "./SelectedItemsDisplay";
import { menu } from "../menuItems";
import CustomerOrder from "./CustomerOrder";

function AACBoard({
    onItemClick,
    selectedItems,
    onSelectItem,
    onDeleteItem,
    onClearAll,
    onPlayAll,
    customerImage,
    burgerOrder,
    drinkOrder,
    hasSide,
    hasIce,
    drinkSize,
    orderVisible,
}) {
    const [currentCustomerImage, setCurrentCustomerImage] = useState(customerImage);

    const [shiftDown, setShiftDown] = useState(false);

    useEffect(() => {
        setCurrentCustomerImage(customerImage);
        const timer = setTimeout(() => {
            if (customerImage) {
                const thinkVersion = customerImage.replace(".png", "_think.png");
                setCurrentCustomerImage(thinkVersion);
            }
        }, 2900);
        return () => clearTimeout(timer);
    }, [customerImage]);

    const handleClick = (item) => {
        if (item.name.toLowerCase() === "burger" || item.name.toLowerCase() === "drink") {
            setShiftDown(true);
        }
        else if (item.name.toLowerCase() === "back") {
            setShiftDown(false);
        }

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
        <div className="AACBoardContainer">
            <SelectedItemsDisplay
                selectedItems={selectedItems}
                onDelete={onDeleteItem}
                onClear={onClearAll}
                onPlayAll={onPlayAll}
            />
            <ItemGrid items={menu} onClick={handleClick} />

            <div className={`imageAndOrder ${shiftDown ? "shiftDown" : ""}`}>
                <img
                    src={currentCustomerImage ?? "/images/customers/empty.png"}
                    alt="Customer"
                    className="manager-image"
                />
                <CustomerOrder
                    burgerOrder={burgerOrder}
                    drinkOrder={drinkOrder}
                    hasSide={hasSide}
                    hasIce={hasIce}
                    drinkSize={drinkSize}
                    orderVisible={orderVisible}
                />
            </div>
        </div>
    );
}

export default AACBoard;
