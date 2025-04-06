import React, { createContext, useEffect, useRef, useState } from "react";

export const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
    const ws = useRef(null);
    const [message, setMessage] = useState(null);

    const setTimestampedMessage = (content) => setMessage({content, timestamp: Date.now()});

    useEffect(() => {
        ws.current = new WebSocket(`ws://${process.env.REACT_APP_BACKEND_DOMAIN}/ws`);
        ws.current.onopen = () => joinLobby().catch(console.error);
        ws.current.onmessage = (event) => setTimestampedMessage(JSON.parse(event.data));

        return () => ws.current.close();
    }, []);

    const send = (object) => ws.current.send(JSON.stringify(object));

    const joinLobby = async () => {
        const response = await fetch(`http://${process.env.REACT_APP_BACKEND_DOMAIN}/lobby/code/join`, { method: "POST" });
        const data = await response.json();
        send({data: { type: "initializer", code: "code", id: data.id }});
    };

    return (
        <WebSocketContext.Provider value={{ message, send }}>
            {children}
        </WebSocketContext.Provider>
    );
}
