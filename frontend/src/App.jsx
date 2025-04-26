import React, { useContext, useState, useEffect } from "react";
import "./App.css";
import BurgerBuilder from "./components/Burger/BurgerBuilder";
import DrinkBuilder from "./components/Drinks/DrinkBuilder";
import SideBuilder from "./components/Sides/SideBuilder";
import AACBoard from "./components/AACBoard/AACBoard";
import MiniOrderDisplay from "./components/Manager/MiniOrderDisplay";
import HomePage from "./components/HomePage";
import Score from "./components/Score/Score";
import GameCompleteModal from "./components/Modal/GameCompleteModal";
import DayCompleteModal from "./components/Modal/DayCompleteModal";
import StationStartModal from "./components/Modal/StationStartModal";
import { useWebSocket, WebSocketContext } from "./WebSocketContext";
import { playPopSound } from "./components/SoundEffects/playPopSound";
import Tutorial from "./components/Modal/Tutorial";

const App = () => {
    const { send } = useContext(WebSocketContext);

    const [selectedRole, setSelectedRole] = useState("side");
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

    const [isGameCompleteModalOpen, setIsGameCompleteModalOpen] = useState(false);
    const [isDayCompleteModalOpen, setIsDayCompleteModalOpen] = useState(false);

    const [score, setScore] = useState("$0.00");
    const [day, setDay] = useState(1);
    const [dayCustomers, setDayCustomers] = useState(0);
    const [dayScore, setDayScore] = useState("$0.00");

    const [showStart, setShowStart] = useState(false);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const handleMessage = (message) => {
        if (!message) return;
        const data = message.data;
        console.log(data);
        switch (data.type) {
            case "lobby_lifecycle":
                switch (data.lifecycle_type) {
                    case "game_end":
                        setIsGameCompleteModalOpen(true);
                        break;
                    default:
                        break;
                }
                break;
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

                        setOrderVisible(false);

                        const delay = Math.floor(Math.random() * 2000) + 2000;

                        setTimeout(() => {
                            setIsCustomerThinking(true);
                            setOrderVisible(true);
                            console.log(`Order and thinking bubble visible after ${delay}ms`);
                        }, delay);

                        break;
                    case "day_end":
                        const dayScore = data.score ?? 0;
                        setDayScore(formatter.format(dayScore / 100));
                        setDayCustomers(data.customers_served);

                        setDay(data.day ?? 0);

                        setIsDayCompleteModalOpen(true);
                        setTimeout(() => {
                            setIsDayCompleteModalOpen(false);
                        }, 10000);
                        break;
                    case "order_component":
                        switch (data.component_type) {
                            case "burger":
                                setEmployeeBurger(data.component.ingredients);
                                break;
                            case "drink":
                                setEmployeeDrink(data.component);
                                break;
                            case "side":
                                setEmployeeSide(data.component);
                                break;
                            default:
                                console.log(`Unknown component type=${data.component_type}`);
                                break;
                        }
                        break;
                    case "role_assignment":
                        setSelectedRole(data.role);
                        if (data.role === "manager") {
                            setShowStart(true);
                        }
                        break;
                    case "order_score":
                        const score = data.score ?? 0;
                        setScore(formatter.format(score / 100));
                        break;
                    default:
                        console.log("Unknown game state update type", data.game_state_update_type);
                        break;
                }
                break;
            default:
                console.log("Unknown message type", data);
                break;
        }
    };

    useWebSocket(handleMessage);

    useEffect(() => {
        if (showStart) {
            const timer = setTimeout(() => {
                setShowStart(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showStart]);

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
        setEmployeeDrink(null);
        setEmployeeSide(null);
    };

    const handleHideDayModal = () => {
        setIsDayCompleteModalOpen(false);
    };

    return (
        <div className="app-container">
            {isGameCompleteModalOpen && <GameCompleteModal score={score} />}
            {isDayCompleteModalOpen && (
                <DayCompleteModal
                    score={dayScore}
                    customers={dayCustomers}
                    handleClick={handleHideDayModal}
                />
            )}
            {selectedRole === "manager" ? (
                <>
                    {showStart && (
                        <StationStartModal
                            stationName="Manager"
                            handleClick={() => setShowStart(false)}
                        />
                    )}

                    {!showStart && (
                        <Tutorial
                            classNames={[
                                "AACBoardContainer",
                                "customer-image",
                            ]}
                            audioSourceFolder={"/audio/tutorial/manager"}
                        />
                    )}

                    <div className="columns">
                        <div className="column">
                            <div className="customer-container">
                                <img
                                    src={customerNumber
                                        ? `/images/customers/customer${customerNumber}${isCustomerThinking ? "_think" : ""}.png`
                                        : "/images/customers/empty.png"}
                                    alt="Customer"
                                    className="customer-image"
                                />
                                {orderVisible && (
                                    <div className="customer-mini-order-overlay">
                                        <MiniOrderDisplay
                                            burger={burgerOrder}
                                            drink={drinkOrder}
                                            side={sideOrder}
                                        />
                                    </div>
                                )}
                                <img
                                    onClick={() => {
                                        handleGiveToCustomer();
                                        playPopSound();
                                    }}
                                    className="SendCustomerOrder"
                                    src="/images/button_icons/send_order.png"
                                    alt="send customer order"
                                />
                                <div className="manager-mini-order-overlay">
                                    <MiniOrderDisplay
                                        burger={employeeBurger}
                                        drink={employeeDrink}
                                        side={employeeSide}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="TopMenu">
                            <Score score={score} day={day} />
                        </div>
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
                </>
            ) : selectedRole === "burger" ? (
                <BurgerBuilder score={score} day={day} />
            ) : selectedRole === "side" ? (
                <SideBuilder score={score} day={day} />
            ) : selectedRole === "drink" ? (
                <DrinkBuilder score={score} day={day} />
            ) : (
                <HomePage />
            )}
        </div>
    );
};

export default App;
