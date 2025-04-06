import { React, useContext, useEffect, useState } from 'react';
import "./Lobby.css";
import { WebSocketContext } from "../WebSocketContext";

function Lobby() {
    const { send, message } = useContext(WebSocketContext);
    const [playerCount, setPlayerCount] = useState(1); // Start with 1 (self)

    useEffect(() => {
        if (!message) return;
        console.log(message);
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
    }

    return (
        <div className="lobby-container">
            <div className="lobby-header">
                <h1 className="lobby-title">AAC Burger</h1>
                <div className="lobby-subtitle">The Ultimate Burger Building Experience</div>
            </div>
            <div className="lobby-content">
                <div className="player-status">
                    <h3>Players in Lobby: {playerCount} / 4</h3>
                    {playerCount < 4 && (
                        <p>Waiting for more players to join...</p>
                    )}
                    {playerCount === 4 && (
                        <p>All players have joined! Ready to start.</p>
                    )}
                </div>
                <div className="lobby-actions">
                    <button
                        className="start-button"
                        onClick={sendStartGame}
                        disabled={playerCount < 2}
                    >
                        Start Game
                    </button>
                    <button className="options-button">Options</button>
                    <button className="credits-button">Credits</button>
                </div>
                <div className="game-description">
                    <h2>Build awesome restaurant orders with your friends!</h2>
                </div>
            </div>
        </div>
    );
}

export default Lobby;
