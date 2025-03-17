import React, { useEffect, useState } from "react";
import AACBoard from "./components/AACBoard";
import ManagerActions from './components/ManagerActions';
import "./App.css";
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";
import SideBuilder from "./components/SideBuilder";
import RoleSelector from "./components/RoleSelector";

const App = () => {
    const [messages, setMessages] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [actionLog, setActionLog] = useState([]);
    const isManager = true;

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
            setActionLog((prev) => [...prev, "Manager: No items to send!"]);
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
        addMessage("Manager: Giving items to the customer...");
    };
    return (
        <div className="app-container">
            <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>
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
                            </>
                        );

                    case "burger":
                        return <BurgerBuilder onSend={(items) => handleBuilderSend("burger", items)}/>;

                    case "side":
                        return <SideBuilder/>;

                    case "drink":
                        return <DrinkBuilder/>;
                }
            })()}

            <h3>Event Log</h3>
            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
            </div>
            <BurgerBuilder />
            <SideBuilder />
            <DrinkBuilder />
        </div>
    );
};

export default App;
