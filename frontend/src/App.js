import React, { useEffect, useState } from "react";
import AACBoard from "./components/AACBoard";
import ManagerActions from './components/ManagerActions';
import "./App.css";
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";
import SideBuilder from "./components/SideBuilder";
const App = () => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState("");


    const [selectedItems, setSelectedItems] = useState([]);
    const [actionLog, setActionLog] = useState([]);
    const isManager = true;

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8000/ws");
        addMessage("Attempting to connect to WebSocket...");

        socket.onopen = () => addMessage("Connected to WebSocket");
        socket.onmessage = (event) => addMessage(event.data);
        socket.onclose = () => addMessage("WebSocket closed");

        setWs(socket);

        return () => socket.close();
    }, []);

    const addMessage = (msg) => {
        setMessages((prev) => [...prev, msg]);
    };

    const sendMessage = () => {
        ws.send(
            JSON.stringify({ data: { type: "chat", message }, source_player_id: 0 })
        );
        setMessage("");
        addMessage(`[Client] Chat sent: "${message}"`);
    };

    const isWebSocketConnecting = ws && ws.readyState === WebSocket.CONNECTING;
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
        setActionLog((prev) => [...prev, `Manager: Sending items: ${names}`]);

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
                });
            }
        }

        setSelectedItems([]);
        setActionLog((prev) => [...prev, "Manager: Order sent and cleared!"]);
    };
    const handleReceiveOrder = () => {
        setActionLog((prev) => [...prev, "Manager: Receiving the order..."]);
    };
    const handleGiveToCustomer = () => {
        setActionLog((prev) => [...prev, "Manager: Giving items to the customer..."]);
    };
    return (
        <div className="app-container">
            <h1>AAC Board</h1>
            { }
            <AACBoard
                selectedItems={selectedItems}
                onSelectItem={addSelectedItem}
                onDeleteItem={removeSelectedItem}
                onClearAll={clearAllSelected}
            />
            {isManager && (
                <div className="manager-section">
                    <h2>Manager Text-Based UI</h2>
                    <ManagerActions
                        actionLog={actionLog}
                        onSendItems={handleSendItems}
                        onReceiveOrder={handleReceiveOrder}
                        onGiveToCustomer={handleGiveToCustomer}
                    />
                </div>
            )}

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
