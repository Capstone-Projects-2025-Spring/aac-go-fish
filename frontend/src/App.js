import React, { useEffect, useState } from "react";
import AACBoard from "./components/AACBoard";
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";

const App = () => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState("");
    const [playerId, setPlayerId] = useState(1);
    const [card, setCard] = useState(1);

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

    return (
        <div style={{ padding: "1rem" }}>
            <h1>AAC Board</h1>
            { }
            <AACBoard />

            <h3>Event Log</h3>
            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
            </div>
            <BurgerBuilder />
            <DrinkBuilder />
        </div>
    );
};

export default App;
