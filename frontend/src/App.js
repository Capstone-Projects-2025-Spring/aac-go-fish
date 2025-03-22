import React, { useEffect, useState } from "react";
import "./App.css";
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";
import SideBuilder from "./components/SideBuilder";
import {mockBurgerOrders, mockDrinkOrders} from "./MockOrders"
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

    const [orderButtonVisible, setOrderButtonVisibility] = useState(true)

    const [burgerOrder, setBurgerOrder] = useState([]);
    const [drinkOrder, setDrinkOrder] = useState([]);
    const [orderHasIce, setOrderHasIce] = useState(false);

    const [layers, setLayers] = useState([]);
    const [hasIce, setHasIce] = useState(false);
    const maxSize = 9;

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
    const handleSendItems = async () => {
        if (selectedItems.length === 0) {
            addMessage("Manager: No items to send!")
            return;
        }

        const names = selectedItems.map((item) => item.name).join(", ");
        addMessage(`Manager: Sending items: ${names}`);

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

        setSelectedItems([]);
        addMessage("Manager: Order sent and cleared!");
    };
    const handleReceiveOrder = () => {
        addMessage("Manager: Receiving the order...");
    };
    const handleGiveToCustomer = () => {
        addMessage("Manager: Sending order to the customer");
        if (burger) {
            addMessage(`Sending burger (${JSON.stringify(burger.map((ingredient) => ingredient.name))})`)
        }
        if (side) {
            addMessage(`Sending side (${side.tableState})`)
        }
        if (drink) {
            addMessage(`Sending drink (${JSON.stringify(drink)})`)
        }
        setBurger(null);
        setSide(null);
        setDrink(null);
    };

    const getRandomOrder = (min,max) => {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    };

    const getBurgerOrder = () => {
        console.log('Button clicked!');

        setOrderButtonVisibility(!orderButtonVisible);
        const randomIndex = getRandomOrder(0,2);
        setBurgerOrder(mockBurgerOrders[randomIndex]);
    };
    const getDrinkOrder = () => {
        console.log('Button clicked!');

        setOrderButtonVisibility(!orderButtonVisible);
        const randomIndex = getRandomOrder(0,2);
        setDrinkOrder(mockDrinkOrders[randomIndex]);

        const randomIce = getRandomOrder(0,1);
        if (randomIce) {
            setOrderHasIce(!orderHasIce);
        }
    };

    const addLayer = (layer) =>{
        if (layers.length <= maxSize){
            setLayers([...layers, layer]);
        }
    };

    const changeIce = () =>{
        setHasIce(!hasIce);
    };

    const clearCup = () =>{
        setLayers([]);
        setHasIce(false);
    };

    return (
        <div className="app-container">

            <div className="main-layout">
                <div className="sidebar">
                    <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>
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
                                                <AACBoard
                                                    selectedItems={selectedItems}
                                                    onSelectItem={addSelectedItem}
                                                    onDeleteItem={removeSelectedItem}
                                                    onClearAll={clearAllSelected}
                                                />
                                            </div>
                                            <div className="column">
                                                <CustomerOrder
                                                    burgerOrder={burgerOrder}
                                                    getBurgerOrder={getBurgerOrder}
                                                    drinkOrder={drinkOrder}
                                                    getDrinkOrder={getDrinkOrder}
                                                    orderButtonVisible={orderButtonVisible}
                                                />
                                            </div>
                                        </div>
                                        <div className="columns">
                                            <div className="column">
                                                <ManagerActions
                                                    onSendItems={handleSendItems}
                                                    onReceiveOrder={handleReceiveOrder}
                                                    onGiveToCustomer={handleGiveToCustomer}
                                                />
                                            </div>
                                            <div className="column">
                                                <MiniOrderDisplay burger={burger} side={side} drink={drink}/>
                                            </div>
                                        </div>
                                    </>
                                );
                            case "burger":
                                return <BurgerBuilder onSend={setBurger}/>;
                            case "side":
                                return <SideBuilder onSend={setSide}/>;
                            case "drink":
                                return <DrinkBuilder onSend={setDrink}/>;
                        }
                    })()}
                </div>
            </div>

        </div>
        </div>
    );
}



export default App;
