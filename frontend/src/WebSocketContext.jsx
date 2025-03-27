import React, { createContext, useEffect, useRef, useState } from "react";

export const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
    const ws = useRef(null);
    const [message, setMessage] = useState(null);

    const setTimestampedMessage = (content) => {
        setMessage({content, timestamp: Date.now()});
    };

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/ws");
        ws.current.onopen = () => {
            joinLobby().catch(console.error);
        };
        ws.current.onmessage = (event) => setTimestampedMessage(JSON.parse(event.data));

        return () => {
            ws.current.close();
        };
    }, []);

    const send = (object) => {
        ws.current.send(JSON.stringify(object));
    };

    const joinLobby = async () => {
        const response = await fetch("http://127.0.0.1:8000/lobby/code/join", { method: "POST" });
        const data = await response.json();
        send({ type: "initializer", code: "code", id: data.id });
        send({ type: "lobby_lifecycle", lifecycle_type: "game_start" });
    };

    return (
        <WebSocketContext.Provider value={{ message, send }}>
            {children}
        </WebSocketContext.Provider>
    );
}
