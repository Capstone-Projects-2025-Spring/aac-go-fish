import React, { useEffect, useState } from "react";
import AACBoard from "./components/AACBoard";
import ManagerActions from './components/ManagerActions';

const App = () => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState("");
    const [playerId, setPlayerId] = useState(1);
    const [card, setCard] = useState(1);

    const [selectedItems, setSelectedItems] = useState([]);
    const [actionLog, setActionLog] = useState([]);


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

    const sendQuery = () => {
        ws.send(
            JSON.stringify({
                data: { type: "query", target_player_id: playerId, card: card },
                source_player_id: 0,
            })
        );
        addMessage(
            `[Client] Game action sent: "Player ${playerId}, got any ${card}s?"`
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
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

        // 3) Clear items
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
        <div style={{ padding: "1rem" }}>
            <h1>AAC Board</h1>
            { }
            <AACBoard
                selectedItems={selectedItems}
                onSelectItem={addSelectedItem}
                onDeleteItem={removeSelectedItem}
                onClearAll={clearAllSelected}
            />

            <div style={{ marginTop: "2rem" }}>
                <h2>Manager Text-Based UI</h2>
                <ManagerActions
                    actionLog={actionLog}
                    onSendItems={handleSendItems}
                    onReceiveOrder={handleReceiveOrder}
                    onGiveToCustomer={handleGiveToCustomer}
                />
            </div>

            <h3>Event Log</h3>
            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
            </div>
        </div>
    );
};

export default App;
