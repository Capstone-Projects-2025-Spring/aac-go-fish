import React, { useContext, useState, useEffect } from 'react';
import Lobby from "./Lobby/Lobby";
import ErrorModal from './Modal/ErrorModal';
import "./HomePage.css";
import { WebSocketContext } from '../WebSocketContext';
import IngredientScrollPicker from "./IngredientScrollPicker/IngredientScrollPicker";

function HomePage() {
    const API_PROTOCOL = window.location.protocol === "https:" ? "https://" : "http://";
    const API_HOST = process.env.REACT_APP_BACKEND_DOMAIN;
    const API_BASE = `${API_PROTOCOL}${API_HOST}`;
    const [lobbyCode, setLobbyCode] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [ingredient1, setIngredient1] = useState('Bottom Bun');
    const [ingredient2, setIngredient2] = useState('Bottom Bun');
    const [ingredient3, setIngredient3] = useState('Bottom Bun');
    const { send } = useContext(WebSocketContext);

    const [isErrorModalOpen, setIsModalErrorOpen] = useState(false);

    useEffect(() => {
        if (window.location.pathname !== "/"){
            const pathname = window.location.pathname.slice(1);
            console.log("Pathname is " + pathname);

            const ingredients = decodeURIComponent(pathname).split('-')
            setIngredient1(ingredients[0] ?? 'Bottom Bun');
            setIngredient2(ingredients[1] ?? 'Bottom Bun');
            setIngredient3(ingredients[2] ?? 'Bottom Bun');
        }
    },[])

    useEffect(() => {
        if(errorMsg){
            setIsModalErrorOpen(true)
            setTimeout(() => {
                handleHideErrorModal()
            }, 5000);
        }
    }, [errorMsg])

    const handleJoin = async (codeArray) => {
        try {
            const response = await fetch(`/api/lobby/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: codeArray }),
            });

            if (!response.ok) {
                const body =  await response.json();
                throw new Error(body.detail);
            }

            const { id } = await response.json();

            send({
                data: {
                    type: "initializer",
                    code: codeArray,
                    id
                }
            });

            setLobbyCode(codeArray.join('-'));
        } catch (err) {
            console.error("Join failed:", err);
            setErrorMsg(err.message);
        }
    };

    const joinLobby = () => {
        const codeArray = [ingredient1, ingredient2, ingredient3];
        if (codeArray.some(c => !c)) {
            alert("Please select all 3 ingredients.");
            return;
        }
        handleJoin(codeArray);
    };

    const createLobby = async () => {
        try {
            const response = await fetch(`/api/lobby`, {
                method: "POST",
            });

            const responseJson = await response.json();
            const code = responseJson.code;

            await handleJoin(code);
        } catch (err) {
            console.error("Create lobby failed:", err);
            setErrorMsg("Failed to create lobby.");
        }
    };

    const handleHideErrorModal = () => {
        setIsModalErrorOpen(false)
        setErrorMsg(null)
    }



    return (
        <div className="homepage-container">
            <div className="lobby-header">
                <h1 className="lobby-title">Order Up!</h1>
                <div className="lobby-subtitle">A Collaborative Cooking Experience</div>
            </div>
            {isErrorModalOpen && <ErrorModal msg={errorMsg} handleClick={handleHideErrorModal} />}
            {!lobbyCode && (
                <>
                    <div className="wheel-picker-row">
                        <IngredientScrollPicker selected={ingredient1} setSelected={setIngredient1} />
                        <IngredientScrollPicker selected={ingredient2} setSelected={setIngredient2} />
                        <IngredientScrollPicker selected={ingredient3} setSelected={setIngredient3} />
                    </div>



                    <div className="homepage-actions">
                        <button
                            className="create-button"
                            onClick={createLobby}
                        >
                            Create Lobby
                        </button>

                        <button
                            className="join-button"
                            onClick={joinLobby}
                            disabled={!ingredient1 || !ingredient2 || !ingredient3}
                        >
                            Join Lobby
                        </button>

                    </div>
                </>
            )}

            {lobbyCode && (
                <>
                    <div className="lobby-code-display">
                        <div className="code-images">
                            {lobbyCode.split('-').map((name, i) => (
                                <img
                                    key={i}
                                    src={`/images/aac_icons/${name.toLowerCase().replace(' ', '_')}.png`}
                                    alt={name}
                                    className="code-image"
                                />
                            ))}
                        </div>
                    </div>
                    <Lobby lobbyCode={lobbyCode} />
                </>
            )}
            <div className="game-description">
                <h3>Cook delicious food with your friends!</h3>
            </div>
        </div>
    );
}

export default HomePage;
