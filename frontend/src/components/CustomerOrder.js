import React, { useState, useEffect } from 'react';
import './CustomerOrder.css';

function CustomerOrder({
    burgerOrder,
    drinkOrder,
    drinkSize,
    hasIce,
    hasSide,
    orderVisible,
    shiftDown,
}) {

    const foodItems = [
        { id: 2, name: 'Bottom Bun', image: '/images/bottom_bun.png', audio: '/audio/bottom_bun.mp3', sideImage: '/images/BottomBunSide.png' },
        { id: 3, name: 'Top Bun', image: '/images/top_bun.png', audio: '/audio/top_bun.mp3', sideImage: '/images/TopBunSide.png' },
        { id: 4, name: 'Patty', image: '/images/patty.png', audio: '/audio/patty.mp3', sideImage: '/images/PattySide.png' },
        { id: 6, name: 'Lettuce', image: '/images/lettuce.png', audio: '/audio/lettuce.mp3', sideImage: '/images/LettuceSide.png' },
        { id: 7, name: 'Onion', image: '/images/onion.png', audio: '/audio/onion.mp3', sideImage: '/images/OnionSide.png' },
        { id: 8, name: 'Tomato', image: '/images/tomato.png', audio: '/audio/tomato.mp3', sideImage: '/images/TomatoSide.png' },
        { id: 9, name: 'Ketchup', image: '/images/ketchup.png', audio: '/audio/ketchup.mp3', sideImage: '/images/KetchupSide.png' },
        { id: 10, name: 'Mustard', image: '/images/mustard.png', audio: '/audio/mustard.mp3', sideImage: '/images/MustardSide.png' },
        { id: 11, name: 'Cheese', image: '/images/cheese.png', audio: '/audio/cheese.mp3', sideImage: '/images/CheeseSide.png' },
    ];

    const drinkLayers = [
        { name: "Blue", color: "#0033CC" },
        { name: "Green", color: "#00CC00" },
        { name: "Yellow", color: "#FFFF00" },
        { name: "Red", color: "#FF0000" },
        { name: "Orange", color: "#FF9900" },
        { name: "Purple", color: "#660099" },
    ];

    // Temporarily set hasIce to false until ice is fully implemented in the drink station
    hasIce = false;
    return (
        <div className="CustomerOrder">
            <div className={`orderDisplay ${shiftDown ? "shiftDown" : ""}`}>

                {orderVisible && (
                    <div className="burgerOrderDisplay">
                        {[...burgerOrder].map((itemName, index) => {
                            const item = foodItems.find(food => food.name === itemName);
                            return item ? (
                                <div key={index} className="foodItem">
                                    <img src={item.sideImage} alt={item.sideImage} />
                                </div>
                            ) : null;
                        })}
                    </div>
                )}

                {orderVisible && hasSide ? (
                    <div className="sideDisplay">
                        <img src="/images/fries.png" alt="Fries" className="Fries" />
                    </div>
                ) : orderVisible ? (
                    <div className='sideDisplay'>
                        <img src="/images/noFries.png" alt="NoFries" className="NoFries" />
                    </div>
                ) : null}

                {drinkOrder && (
                    <div className="mockDisplayCup" style={{ backgroundColor: drinkOrder[1], color: "#FFFFFF" }}>
                    </div>
                )}

            </div>


        </div>
    );
};

export default CustomerOrder;
