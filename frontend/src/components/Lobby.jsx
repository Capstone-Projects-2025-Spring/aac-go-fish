import { React, useContext} from 'react';
import "./Lobby.css";
import { WebSocketContext } from "../WebSocketContext";



function Lobby() {

    const { send } = useContext(WebSocketContext);
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
                <div className="lobby-actions">
                    <button className="start-button" onClick={sendStartGame}>Start Game</button>
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
