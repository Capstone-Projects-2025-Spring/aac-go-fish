import React, { useEffect, useState } from "react";
import "./App.css";
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";
import SideBuilder from "./components/SideBuilder";
import { mockBurgerOrders, mockDrinkOrders } from "./MockOrders"
import RoleSelector from "./components/RoleSelector";
import AACBoard from "./components/AACBoard";
import CustomerOrder from "./components/CustomerOrder";
import ManagerActions from "./components/ManagerActions";
import MiniOrderDisplay from "./components/MiniOrderDisplay";

const App = () => {
    const [messages, setMessages] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [burger, setBurger] = useState(null);
    const [side, setSide] = useState(null);
    const [drink, setDrink] = useState(null);

    const [actionLog, setActionLog] = useState([]);
    const isManager = true;

    const [orderVisible, setOrderVisible] = useState(false)

    const [burgerOrder, setBurgerOrder] = useState([]);
    const [drinkOrder, setDrinkOrder] = useState([]);

    //// Temporarily not used until ice is fully implemented in the drink station
    const [orderHasIce, setOrderHasIce] = useState(false);
    const [drinkSize, setDrinkSize] = useState('medium');

    const [score, setScore] = useState(0)

    const [layers, setLayers] = useState([]);
    const maxSize = 9;

    const [hasSide, setHasSide] = useState(false);
    const customerImages = [
        "/images/customers/customer1.png",
        "/images/customers/customer2.png",
        "/images/customers/customer3.png",
        "/images/customers/customer4.png",
        "/images/customers/customer5.png",

    ];
    const [customerImage, setCustomerImage] = useState("/images/customers/empty.png");


    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8000/ws");
        addMessage("Attempting to connect to WebSocket...");

        socket.onopen = () => addMessage("Connected to WebSocket");
        socket.onmessage = (event) => addMessage(event.data);
        socket.onclose = () => addMessage("WebSocket closed");

        return () => socket.close();
    }, []);

    const addMessage = (msg) => {
        setMessages((prev) => [...prev, msg]);
    };

    const addSelectedItem = (item) => {
        setSelectedItems((prev) => [...prev, item]);
    };
    const removeSelectedItem = (indexToDelete) => {
        setSelectedItems((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    };

    const clearAllSelected = () => {
        setSelectedItems([]);
    };
    const onPlayAll = async () => {
        if (selectedItems.length === 0) {
            addMessage("Manager: No phrase to play!")
            return;
        }

        const names = selectedItems.map((item) => item.name).join(", ");
        addMessage(`Manager: Playing phrase: ${names}`);

        for (const item of selectedItems) {
            if (item.audio) {
                const audio = new Audio(item.audio);
                await new Promise((resolve) => {
                    audio.play()
                        .then(() => {
                            addMessage(`Manager: Playing ${item.audio}`);
                            audio.onended = resolve;
                        }, () => {
                            addMessage(`Manager: Failed to play ${item.audio} (Does the file exist?)`);
                            resolve();
                        })
                });
            }
        }

        addMessage("Manager: Played phrase!");
    };
    const handleReceiveOrder = () => {
        setOrderVisible(true);
        getBurgerOrder();
        getDrinkOrder();
        getSideOrder();
        const randomIndex = Math.floor(Math.random() * customerImages.length);
        const randomCustomer = customerImages[randomIndex];
        setCustomerImage(randomCustomer);
        console.log("Random customer selected:", randomCustomer);
        addMessage("Manager: Receiving the order...");
    };
    const getScoring = ({ burger, side, drink }) => {
        // Temporarily scoring function while no scoring in backend
        var tempScore = 0

        if (burger) {
            // 3 points for submitting any burger, +2 points if correct
            tempScore += 3
            if (JSON.stringify(burger) === JSON.stringify(burgerOrder)) {
                tempScore += 2
                addMessage(`Manager: Burger order is correct`)
            } else {
                addMessage(`Manager: Burger order is incorrect`)
            }
        }
        if (side) {
            // 1 point for submitting any side, +2 points if correct
            tempScore += 1
            if (hasSide && side === 'fries') {
                tempScore += 2
                addMessage(`Manager: Side order is correct`)
            } else {
                addMessage(`Manager: Side order is incorrect`)
            }
        }
        if (drink) {
            // 2 points for submitting any drink, +2 points if correct
            tempScore += 2

            // Test object, fill and ice are hardcoded for now
            const drinkObj = { color: drinkOrder[1], fillPercentage: 100, hasIce: false, cupSize: drinkSize }
            if (JSON.stringify(drink) === JSON.stringify(drinkObj)) {
                tempScore += 2
                addMessage(`Manager: Drink order is correct`)
            } else {
                addMessage(`Manager: Drink order is incorrect`)
            }
        }
        addMessage(`Score is ${tempScore}`)
        setScore(score + tempScore)
    }
    const handleGiveToCustomer = () => {
        addMessage("Manager: Sending order to the customer");

        var tempBurger = null
        var tempSide = null
        if (burger) {
            tempBurger = burger.map((ingredient) => ingredient.name)
            addMessage(`Sending burger (${JSON.stringify(tempBurger)})`)
        }
        if (side) {
            tempSide = side.tableState
            addMessage(`Sending side (${side.tableState})`)
        }
        if (drink) {
            addMessage(`Sending drink (${JSON.stringify(drink)})`)
        }

        // Temporarily score function while no scoring in backend
        getScoring({ burger: tempBurger, side: tempSide, drink: drink })

        setBurger(null);
        setSide(null);
        setDrink(null);
    };

    const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    };

    const getBurgerOrder = () => {
        console.log('Button clicked!');


        const randomIndex = getRandomNumber(0, 2);
        setBurgerOrder(mockBurgerOrders[randomIndex]);
    };
    const getDrinkOrder = () => {
        console.log('Button clicked!');

        const randomIndex = getRandomNumber(0, 5);
        setDrinkOrder(mockDrinkOrders[randomIndex]);

        const sizes = ['small', 'medium', 'large']
        const randomSize = getRandomNumber(0, 2);
        setDrinkSize(sizes[randomSize]);
        console.log(drinkSize);

        // Temporarily not used until ice is fully implemented in the drink station
        const randomIce = getRandomNumber(0, 2);
        if (randomIce) {
            setOrderHasIce(!orderHasIce);
        }
    };
    const getSideOrder = () => {
        const randomSide = getRandomNumber(0, 1);

        if (randomSide) {
            setHasSide(!hasSide);
        }
    };

    const addLayer = (layer) => {
        if (layers.length <= maxSize) {
            setLayers([...layers, layer]);
        }
    };

    return (
        <div className="app-container">

            <div className="main-layout">
                <div className="sidebar">
                    <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
                    <h3>Event Log</h3>
                    <div className="event-log">
                        {messages.map((msg, idx) => (
                            <div key={idx}>{msg}</div>
                        ))}
                    </div>
                </div>
                <div className="main-layout">
                    <div className="stations">
                        {(() => {
                            switch (selectedRole) {
                                case "manager":
                                    return (
                                        <>
                                            <div className="columns">
                                                <div className="column">
                                                    Your score is ${score}
                                                    <AACBoard
                                                        selectedItems={selectedItems}
                                                        onSelectItem={addSelectedItem}
                                                        onDeleteItem={removeSelectedItem}
                                                        onClearAll={clearAllSelected}
                                                        onPlayAll={onPlayAll}
                                                        customerImage={customerImage}
                                                    />
                                                </div>
                                                <div className="column">
                                                    <CustomerOrder
                                                        burgerOrder={burgerOrder}
                                                        drinkOrder={drinkOrder}
                                                        hasIce={orderHasIce}
                                                        hasSide={hasSide}
                                                        drinkSize={drinkSize}
                                                        orderVisible={orderVisible}

                                                    />
                                                </div>
                                            </div>
                                            <div className="columns">
                                                <div className="column">
                                                    <ManagerActions
                                                        onReceiveOrder={handleReceiveOrder}
                                                        onGiveToCustomer={handleGiveToCustomer}
                                                    />
                                                </div>
                                                <div className="column">
                                                    <MiniOrderDisplay burger={burger} side={side} drink={drink} />
                                                </div>
                                            </div>
                                        </>
                                    );
                                case "burger":
                                    return <BurgerBuilder onSend={setBurger} />;
                                case "side":
                                    return <SideBuilder onSend={setSide} />;
                                case "drink":
                                    return <DrinkBuilder onSend={setDrink} />;
                            }
                        })()}
                    </div>
                </div>

            </div>
        </div>
    );
}



export default App;
