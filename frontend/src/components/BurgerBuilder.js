import React, { useState } from 'react';
import './BurgerBuilder.css';
const BurgerBuilder = () => {
    const [ingredients, setIngredients] = useState([]);

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

    const addIngredient = (ingredient) =>{
        setIngredients([...ingredients,ingredient.sideImage]);
    };
    return(
        <div className="BurgerBuilder">
            <h1>Burger Station</h1>
            <div className="IngredientButtons">
                {foodItems.map((ingredient, index) => (
                    <button key={index} onClick={() => addIngredient(ingredient)}>
                        <img src={ingredient.image} alt ={ingredient.name} className= "IngredientImage" />
                        <p>{ingredient.name}</p>
                    </button>
                ))}
            </div>

            <div className = "Burger">
                {ingredients.map((image,index) => (
                    <img
                        key={index}
                        src={image}
                        alt={'Ingredient ${index}'}
                        className="BurgerIngredient"
                    />
                ))}
            </div>
            <div className="Plate">
            </div>
            <h2>Your Plate</h2>
        </div>
    );
};

export default BurgerBuilder;
