import React from 'react';
import './CustomerOrder.css';

function CustomerOrder({
    order,
    getOrder,
}) {


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


    return (
        <div className = "CustomerOrder">
            <div className = "orderButton">
                <button
                onClick={getOrder}
                id = "getOrderButton" class = "button" type="button">
                    Get Order
                </button>
            </div>
            <div className = "orderDisplay">
                {[...order].map((itemName,index) => {
                    const item = foodItems.find(food => food.name === itemName);
                    return item ? (
                        <div key={index} className="foodItem">
                            <img src={item.image} alt={item.image}/>
                        </div>
                    ) : null;
                })}
            </div>

        </div>

    );
};

export default CustomerOrder;
