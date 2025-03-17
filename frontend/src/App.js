import React, { useEffect, useState } from "react";
import "./App.css";
import AACBoard from "./components/AACBoard";
import ManagerActions from './components/ManagerActions';
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";
import SideBuilder from "./components/SideBuilder";
import RoleSelector from "./components/RoleSelector";
import MiniOrderDisplay from "./components/MiniOrderDisplay";

const App = () => {
    const [messages, setMessages] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [burger, setBurger] = useState(null);
    const [side, setSide] = useState(null);
    const [drink, setDrink] = useState(null);

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
                    audio.onended = resolve;
                    audio.onerror = resolve;
                    audio.play().catch((err) => {
                        console.error('Audio playback failed:', err);
                        resolve();
                    });
                    addMessage(`Manager: Playing ${item.audio}`)
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

                <div className="stations">
                    {(() => {
                        switch (selectedRole) {
                            case "manager":
                                return (
                                    <>
                                        <AACBoard
                                            selectedItems={selectedItems}
                                            onSelectItem={addSelectedItem}
                                            onDeleteItem={removeSelectedItem}
                                            onClearAll={clearAllSelected}
                                        />
                                        <ManagerActions
                                            onSendItems={handleSendItems}
                                            onReceiveOrder={handleReceiveOrder}
                                            onGiveToCustomer={handleGiveToCustomer}
                                        />
                                        <MiniOrderDisplay burger={burger} side={side} drink={drink}/>
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
    );
}


export default App;
