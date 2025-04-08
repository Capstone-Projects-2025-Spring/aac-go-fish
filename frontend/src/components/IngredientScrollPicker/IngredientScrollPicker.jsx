import React, { useState, useEffect } from 'react';
import './IngredientScrollPicker.css';
import { menu } from "../../menuItems";
const burgerOptions = menu[0].children;

const IngredientScrollPicker = ({ selected, setSelected }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const index = burgerOptions.findIndex(item => item.name === selected);
        if (index !== -1) setCurrentIndex(index);
    }, [selected]);

    const scrollUp = () => {
        const newIndex = (currentIndex - 1 + burgerOptions.length) % burgerOptions.length;
        setCurrentIndex(newIndex);
        setSelected(burgerOptions[newIndex].name);
    };

    const scrollDown = () => {
        const newIndex = (currentIndex + 1) % burgerOptions.length;
        setCurrentIndex(newIndex);
        setSelected(burgerOptions[newIndex].name);
    };

    const currentItem = burgerOptions[currentIndex];

    return (
        <div className="scroll-picker">
            <button className="scroll-button" onClick={scrollUp}>▲</button>
            <div className="selected-image">
                <img src={currentItem.image} alt={currentItem.name} />
            </div>
            <button className="scroll-button" onClick={scrollDown}>▼</button>
        </div>
    );
};

export default IngredientScrollPicker;
