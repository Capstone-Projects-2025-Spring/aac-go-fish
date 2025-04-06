import React, { useContext, useEffect, useState } from 'react';
import './Lobby.css';
import { WebSocketContext } from '../WebSocketContext';

function Lobby() {
    const { send, message } = useContext(WebSocketContext);
    const [playerCount, setPlayerCount] = useState(1);

    useEffect(() => {
        if (!message) return;
        const data = message.content.data;
        if (data &&
            data.type === "lobby_lifecycle" &&
            data.lifecycle_type === "player_count") {
            setPlayerCount(data.count);
        }
    }, [message]);

    const sendStartGame = () => {
        send({
            data: {
                type: "lobby_lifecycle",
                lifecycle_type: "game_start",
            }
        });
    };

    return (
        <div className="lobby-content">
            <div className="player-status">
                <h3>Players in Lobby: {Math.min(playerCount, 4)} / 4</h3>
                {playerCount < 2 && <h4>Waiting for more players to join...</h4>}
                {(playerCount == 2 || playerCount == 3) && <h4>You have company! Wait for more players or start game now!</h4>}
                {playerCount >= 4 && <h4>Max players have joined!</h4>}
            </div>
            <div className="lobby-actions">
                <button
                    className="start-button"
                    onClick={sendStartGame}
                    disabled={playerCount < 2}
                >
                    Start Game
                </button>
            </div>
        </div>
    );
}

export default Lobby;
