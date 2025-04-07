import React, { useContext, useState } from "react";
import "./App.css";
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";
import SideBuilder from "./components/SideBuilder";
import AACBoard from "./components/AACBoard";
import MiniOrderDisplay from "./components/MiniOrderDisplay";
import HomePage from "./components/HomePage";
import { useWebSocket, WebSocketContext } from "./WebSocketContext";

const App = () => {
    const { send } = useContext(WebSocketContext);

    const [selectedRole, setSelectedRole] = useState();
    const [selectedItems, setSelectedItems] = useState([]);
    const [employeeBurger, setEmployeeBurger] = useState(null);
    const [employeeSide, setEmployeeSide] = useState(null);
    const [employeeDrink, setEmployeeDrink] = useState(null);

    const [burgerOrder, setBurgerOrder] = useState([]);
    const [sideOrder, setSideOrder] = useState(null);
    const [drinkOrder, setDrinkOrder] = useState(null);
    const [orderVisible, setOrderVisible] = useState(false);

    const [customerNumber, setCustomerNumber] = useState(0);
    const [isCustomerThinking, setIsCustomerThinking] = useState(false);

    const [score, setScore] = useState(0);
    const [day, setDay] = useState(1);

    const handleMessage = (message) => {
        if (!message) return;
        const data = message.content.data;
        console.log(data.type);
        switch (data.type) {
            case "game_state":
                switch (data.game_state_update_type) {
                    case "new_order":
                        const burger = data.order.burger?.ingredients ?? [];
                        const drink = data.order.drink ?? null;
                        const side = data.order.side ?? null;

                        setBurgerOrder(burger);
                        setDrinkOrder(drink);
                        setSideOrder(side);

                        setCustomerNumber((customerNumber + 1) % 10);

                        setOrderVisible(true);

                        const delay = Math.floor(Math.random() * 2000) + 2000;

                        setTimeout(() => {
                            setIsCustomerThinking(true);
                            setOrderVisible(true);
                            console.log(`Order and thinking bubble visible after ${delay}ms`);
                        }, delay);

                        break;
                    case "day_end":
                        const day = data.day ?? 0;

                        setDay(day);
                        break;
                    case "order_component":
                        switch (data.component_type) {
                            case "burger":
                                console.log("burger");
                                setEmployeeBurger(message.content.data.component.ingredients);
                                break;
                            case "drink":
                                console.log("drink");
                                setEmployeeDrink(message.content.data.component);
                                break;
                            case "side":
                                console.log("side");
                                setEmployeeSide(message.content.data.component);
                                break;
                            default:
                                console.log(`Unknown component type=${data.component_type}`);
                                break;
                        }
                        break;
                    case "role_assignment":
                        console.log("role_assignment");
                        setSelectedRole(data.role);
                        break;
                    case "order_score":
                        console.log("order_score")
                        setScore(data.score);
                        break;
                    default:
                        console.log("Unknown game state update type", data.game_state_update_type);
                        break;
                }
                break;
            default:
                console.log("Unknown message type", data.type);
                break;
        }
    };

    useWebSocket(handleMessage);

    const addSelectedItem = (item) => setSelectedItems((prev) => [...prev, item]);
    const removeSelectedItem = (indexToDelete) =>
        setSelectedItems((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    const clearAllSelected = () => setSelectedItems([]);

    const onPlayAll = async () => {
        if (selectedItems.length === 0) return;
        for (const item of selectedItems) {
            if (item.audio) {
                const audio = new Audio(item.audio);
                await new Promise((resolve) => {
                    audio.play().then(() => {
                        audio.onended = resolve;
                    }).catch(resolve);
                });
            }
        }
    };

    const handleGiveToCustomer = () => {
        send({
            data: {
                type: "game_state",
                game_state_update_type: "order_submission",
                order: {
                    burger: {
                        ingredients: employeeBurger
                    },
                    drink: employeeDrink,
                    side: employeeSide
                }
            }
        });

        setEmployeeBurger(null);
        setEmployeeSide(null);
        setEmployeeDrink(null);
    };

    return (
        <div className="app-container">
            {selectedRole === "manager" ? (
                <>
                    <div className="columns">
                        <div className="column">
                            <div className="customer-container">
                                <img
                                    src={customerNumber ? `/images/customers/customer${customerNumber}${isCustomerThinking ? "_think" : ""}.png` : "/images/customers/empty.png"}
                                    alt="Customer"
                                    className="customer-image"
                                />
                                {orderVisible && (
                                    <div className="customer-mini-order-overlay">
                                        <MiniOrderDisplay burger={burgerOrder} side={sideOrder} drink={drinkOrder} />
                                    </div>
                                )}
                                <img onClick={handleGiveToCustomer} className="SendCustomerOrder" src="/images/send_order.png" alt="send customer order" />
                                <div className="manager-mini-order-overlay">
                                    <MiniOrderDisplay burger={employeeBurger} side={employeeSide} drink={employeeDrink} />
                                </div>
                            </div>
                        </div>
                        <div className="right-column">
                            <p className='Score'>Day {day} - ${score}</p>

                            <AACBoard
                                selectedItems={selectedItems}
                                onSelectItem={addSelectedItem}
                                onDeleteItem={removeSelectedItem}
                                onClearAll={clearAllSelected}
                                onPlayAll={onPlayAll}
                                burgerOrder={burgerOrder}
                                drinkOrder={drinkOrder}
                                hasSide={!!sideOrder}
                                drinkSize={"medium"}
                                orderVisible={orderVisible}
                            />
                        </div>
                    </div>
                </>
            ) : selectedRole === "burger" ? (
                <BurgerBuilder score={score} />
            ) : selectedRole === "side" ? (
                <SideBuilder score={score} />
            ) : selectedRole == "drink" ? (
                <DrinkBuilder score={score} />
            ) : <HomePage />}
        </div>
    );
};

export default App;
