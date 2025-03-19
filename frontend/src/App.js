import React, { useEffect, useState } from "react";
import AACBoard from "./components/AACBoard";
import CustomerOrder from "./components/CustomerOrder";
import ManagerActions from './components/ManagerActions';
import {mockBurgerOrders, mockDrinkOrders} from "./MockOrders"
import "./App.css";
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";
import SideBuilder from "./components/SideBuilder";
const App = () => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState("");


    const [selectedItems, setSelectedItems] = useState([]);
    const [actionLog, setActionLog] = useState([]);
    const isManager = true;

    const [burgerOrder, setBurgerOrder] = useState([]);
    const [drinkOrder, setDrinkOrder] = useState([]);
    const [orderHasIce, setOrderHasIce] = useState(false);

    const [layers, setLayers] = useState([]);
    const [hasIce, setHasIce] = useState(false);
    const maxSize = 9;

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

    const isWebSocketConnecting = ws && ws.readyState === WebSocket.CONNECTING;
    const addSelectedItem = (item) => {
        setSelectedItems((prev) => [...prev, item]);
    };
    const removeSelectedItem = (indexToDelete) => {
        setSelectedItems((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    };

    const clearAllSelected = () => {
        setSelectedItems([]);
    };
    const handleSendItems = async () => {
        if (selectedItems.length === 0) {
            setActionLog((prev) => [...prev, "Manager: No items to send!"]);
            return;
        }

        const names = selectedItems.map((item) => item.name).join(", ");
        setActionLog((prev) => [...prev, `Manager: Sending items: ${names}`]);

        for (const item of selectedItems) {
            if (item.audio) {
                const audio = new Audio(item.audio);
                await new Promise((resolve) => {
                    audio.onended = resolve;
                    audio.onerror = resolve;
                    audio.play().catch((err) => {
                        console.error('Audio playback failed:', err);
                        resolve();
                    });
                });
            }
        }

        setSelectedItems([]);
        setActionLog((prev) => [...prev, "Manager: Order sent and cleared!"]);
    };
    const handleReceiveOrder = () => {
        setActionLog((prev) => [...prev, "Manager: Receiving the order..."]);
    };
    const handleGiveToCustomer = () => {
        setActionLog((prev) => [...prev, "Manager: Giving items to the customer..."]);
    };

    const getRandomOrder = (min,max) => {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    };

    const getBurgerOrder = () => {
        console.log('Button clicked!');

        document.getElementById("getOrderButton").hidden = "True";
        const randomIndex = getRandomOrder(0,2);
        setBurgerOrder(mockBurgerOrders[randomIndex]);
    };
    const getDrinkOrder = () => {
        console.log('Button clicked!');

        document.getElementById("getOrderButton").hidden = "True";
        const randomIndex = getRandomOrder(0,2);
        setDrinkOrder(mockDrinkOrders[randomIndex]);

        const randomIce = getRandomOrder(0,1);
        console.log(randomIce);
        if (randomIce) {
            setOrderHasIce(!orderHasIce);
        }
    };

    const addLayer = (layer) =>{
        if (layers.length <= maxSize){
            setLayers([...layers, layer]);
        }
        else{
            alert("Cup is full!");
        }

    };

    const changeIce = () =>{
        setHasIce(!hasIce);
    };

    const clearCup = () =>{
        setLayers([]);
        setHasIce(false);
    };

    return (
        <div className="app-container">
            <div style={{ padding: "1rem" }}>
                <h1>Customer Order</h1>
                <CustomerOrder
                    burgerOrder = {burgerOrder}
                    drinkOrder={drinkOrder}
                    layers = {layers}
                    hasIce = {orderHasIce}
                    getBurgerOrder = {() => getBurgerOrder(mockBurgerOrders)}
                    getDrinkOrder = {() => getDrinkOrder(mockDrinkOrders)}
                />
            </div>
            <h1>AAC Board</h1>
            { }
            <AACBoard
                selectedItems={selectedItems}
                onSelectItem={addSelectedItem}
                onDeleteItem={removeSelectedItem}
                onClearAll={clearAllSelected}
            />
            {isManager && (
                <div className="manager-section">
                    <h2>Manager Text-Based UI</h2>
                    <ManagerActions
                        actionLog={actionLog}
                        onSendItems={handleSendItems}
                        onReceiveOrder={handleReceiveOrder}
                        onGiveToCustomer={handleGiveToCustomer}
                    />
                </div>
            )}

            <h3>Event Log</h3>
            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
            </div>
            <BurgerBuilder />
            <SideBuilder />
            <DrinkBuilder
                hasIce={hasIce}
                layers={layers}
                addLayer={addLayer}
                changeIce={changeIce}
                clearCup={clearCup}
            />
        </div>
    );
};

export default App;
