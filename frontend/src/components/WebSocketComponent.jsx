import React, {useEffect, useRef} from 'react';

export default function WebSocketComponent({addMessage, playerId}) {
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/ws');

        ws.current.onopen = () => {
            addMessage("Websocket connected");
        };
        ws.current.onclose = () => addMessage("Websocket disconnected");
        ws.current.onmessage = (event) => addMessage(`Server: ${event.data}`);

        return () => {
            ws.current.close();
        };
    }, []);

    const send = (object) => {
        ws.current.send(JSON.stringify(object));
    };

    const sendInitializer = () => {
        const object = {
            type: "initializer", code: "code", id: playerId,
        };
        send(object);
    }

    const startGame = () => {
        const object = {
            type: "lobby_lifecycle", lifecycle_type: "game_start",
        };
        send(object);
    }


    return (<div>
        <button onClick={sendInitializer} disabled={playerId === null}>Initialize</button>
        <button onClick={startGame} disabled={playerId === null}>Start game</button>
    </div>);
}