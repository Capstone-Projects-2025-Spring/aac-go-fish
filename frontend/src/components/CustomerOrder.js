import './CustomerOrder.css';

function CustomerOrder() {
    function getRandomOrder(min,max){
        return Math.floor(Math.random() * (max + 1 - min) + min);
    };

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

    const mockOrders = [
        ['Bottom Bun', 'Mustard', 'Lettuce', 'Tomato', 'Patty', 'Cheese', 'Ketchup', 'Top Bun'],
        ['Bottom Bun', 'Ketchup', 'Lettuce', 'Onion', 'Patty', 'Cheese', 'Onion', 'Ketchup','Top Bun'],
        ['Bottom Bun', 'Tomato', 'Patty','Onion', 'Mustard', 'Ketchup', 'Top Bun'],
    ];

    //console.log(mockOrders)
    //const randomNumber = Math.random() * 10;

    /*let orderCount = [0,0,0];
    for (let i = 0; i < 100; i++){
        order = getRandomOrder(0,2)
        orderCount[order]++;
    }
    console.log(orderCount);
    */

    return (
        <div className = "CustomerOrder">
            <button class = "button" type="button">Get Order</button>
        </div>
    );
};

export default CustomerOrder;
