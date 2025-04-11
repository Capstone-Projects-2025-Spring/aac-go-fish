import React, { useContext, useState } from 'react';
import './Lobby.css';
import { useWebSocket, WebSocketContext } from '../../WebSocketContext';

function Lobby({ lobbyCode }) {
    const [playing, setPlaying] = useState(false);
    const [copied, setCopied] = useState(false);
    const [playerCount, setPlayerCount] = useState(1);
    const { send } = useContext(WebSocketContext);

    const handleMessage = (message) => {
        if (!message) return;
        const data = message.data;
        if (data &&
            data.type === "lobby_lifecycle" &&
            data.lifecycle_type === "player_count") {
            setPlayerCount(data.count);
        }
    };

    useWebSocket(handleMessage);

    const sendStartGame = () => {
        send({
            data: {
                type: "lobby_lifecycle",
                lifecycle_type: "game_start",
            }
        });
    };

    const copyCode = () => {
        const URL = window.location.protocol + "//" + window.location.hostname + "/" + encodeURIComponent(lobbyCode);
        navigator.clipboard.writeText(URL);

        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    const playAll = () => {
        if (playing) return;
        if (!lobbyCode) return;
        const names = lobbyCode.split('-');
        if (names.length !== 3) return;
        const paths = names.map(n =>
            `/audio/${n.toLowerCase().replace(' ', '_')}.mp3`
        );

        let idx = 0;
        const audio = new Audio(paths[0]);
        setPlaying(true);

        audio.addEventListener('ended', () => {
            idx += 1;
            if (idx < paths.length) {
                audio.src = paths[idx];
                audio.play().catch(() => { });
            } else {
                setPlaying(false);
            }
        });

        audio.play().catch(() => setPlaying(false));
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
                <button
                    className="play-all-btn"
                    onClick={playAll}
                    disabled={playing || !lobbyCode || lobbyCode.split('-').length !== 3}                >
                    {playing ? '🗣️' : '🔊'}
                </button>
                <button
                    className="copy-link-btn"
                    onClick={copyCode}>
                    {copied ? '✅' : '🔗'}
                </button>
            </div>
        </div >
    );
}

export default Lobby;
