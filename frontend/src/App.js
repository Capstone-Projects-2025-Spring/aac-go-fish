import React, { useEffect, useState } from "react";
import AACBoard from "./components/AACBoard";
import CustomerOrder from "./components/CustomerOrder";

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

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Test CustomerOrder</h1>
            <CustomerOrder />
            <h1>AAC Board</h1>
            { }
            <AACBoard />

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
