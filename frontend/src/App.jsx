import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";
import SideBuilder from "./components/SideBuilder";
import AACBoard from "./components/AACBoard";
import ManagerActions from "./components/ManagerActions";
import MiniOrderDisplay from "./components/MiniOrderDisplay";
import { WebSocketContext } from "./WebSocketContext";
import Lobby from "./components/Lobby";

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
    const { message } = useContext(WebSocketContext);

    useEffect(() => {
        if (!message) return;
        console.log(message);
        const data = message.content.data;
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

                        setOrderVisible(false);

                        const delay = Math.floor(Math.random() * 2000) + 3000;

                        setTimeout(() => {
                            setIsCustomerThinking(true);
                            setOrderVisible(true);
                            console.log(`Order and thinking bubble visible after ${delay}ms`);
                        }, delay);

                        break;
                    case "order_component":
                        switch(data.component_type) {
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
                        if (!selectedRole){
                            setSelectedRole(data.role);
                        }
                        break;
                    default:
                        console.log("Unknown game state update type");
                        break;
                }
                break;
            default:
                console.log("Unknown message type");
                break;
        }
    }, [message]);

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

    const getScoring = ({ burger, side, drink }) => {
        let tempScore = 0;

        if (burger) {
            tempScore += 3;
            if (JSON.stringify(burger) === JSON.stringify(burgerOrder)) tempScore += 2;
        }

        if (side) {
            tempScore += 1;
            if (side === 'fries') tempScore += 2;
        }

        if (drink) {
            tempScore += 2;
            const drinkObj = { color: null, fillPercentage: 100, size: null };
            if (JSON.stringify(drink) === JSON.stringify(drinkObj)) tempScore += 2;
        }

        setScore(score + tempScore);
    };

    const handleGiveToCustomer = () => {
        send({data: {
            type: "game_state",
            game_state_update_type: "order_submission",
            order: {
                burger: {
                    ingredients: employeeBurger
                },
                drink: employeeDrink,
                side: employeeSide
        }}});

        getScoring({
            burger: employeeBurger,
            side: employeeSide?.tableState,
            drink: employeeDrink,
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
                        {orderVisible && (
                            <MiniOrderDisplay burger={burgerOrder} side={sideOrder} drink={drinkOrder} />
                        )}                        </div>
                    <div className="column">
                        <p className='Score'>Your score is ${score}</p>
                        <img
                            src={customerNumber ? `/images/customers/customer${customerNumber}${isCustomerThinking ? "_think" : ""}.png` : "/images/customers/empty.png"}
                            alt="Customer"
                            className="manager-image top-left-customer"
                        />

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
                        <div>
                            <MiniOrderDisplay burger={employeeBurger} side={employeeSide} drink={employeeDrink} />
                        </div>

                        <ManagerActions onGiveToCustomer={handleGiveToCustomer}/>

                    </div>

                </>
            ) : selectedRole === "burger" ? (
                <BurgerBuilder score={score} />
            ) : selectedRole === "side" ? (
                <SideBuilder score={score} />
            ) : selectedRole == "drink" ? (
                <DrinkBuilder score={score} />
            ) : <Lobby/>}
        </div>
    );
};

export default App;
