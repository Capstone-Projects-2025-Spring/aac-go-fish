import React, {createContext, useContext, useEffect, useRef} from "react";

export const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
    const ws = useRef(null);
    const queue = useRef([]);
    const listeners = useRef(new Set());

    const processMessages = () => {
        if (queue.current.length === 0) return;
        const message = queue.current.shift();
        for (let listener of listeners.current) {
            listener(message);
        }
    };

    const addListener = (fn) => listeners.current.add(fn);
    const removeListener = (fn) => listeners.current.delete(fn);

    useEffect(() => {
	    const proto = window.location.protocol === "https:" ? "wss" : "ws";
	    ws.current = new WebSocket(`${proto}://${window.location.host}/api/ws`);
        ws.current.onmessage = (event) => {
            queue.current.push(JSON.parse(event.data));
			processMessages();
        };
        return () => ws.current.close();
    }, []);

    const send = (object) => ws.current?.send(JSON.stringify(object));

    return (
        <WebSocketContext.Provider value={{ addListener, removeListener, send }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket(handleMessage) {
    const { addListener, removeListener } = useContext(WebSocketContext);

    useEffect(() => {
        addListener(handleMessage);
        return () => removeListener(handleMessage);
    }, [addListener, removeListener, handleMessage]);
}
