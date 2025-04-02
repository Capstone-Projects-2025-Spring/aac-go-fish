import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";
import SideBuilder from "./components/SideBuilder";
import RoleSelector, { Roles } from "./components/RoleSelector";
import AACBoard from "./components/AACBoard";
import ManagerActions from "./components/ManagerActions";
import MiniOrderDisplay from "./components/MiniOrderDisplay";
import { WebSocketContext } from "./WebSocketContext";
import Customer from "./components/Customer";

const App = () => {
    const [selectedRole, setSelectedRole] = useState(Roles.MANAGER);
    const [selectedItems, setSelectedItems] = useState([]);
    const [employeeBurger, setEmployeeBurger] = useState(null);
    const [employeeSide, setEmployeeSide] = useState(null);
    const [employeeDrink, setEmployeeDrink] = useState(null);

    const [burgerOrder, setBurgerOrder] = useState([]);
    const [sideOrder, setSideOrder] = useState(null);
    const [drinkOrder, setDrinkOrder] = useState(null);

    const [baseCustomerImage, setBaseCustomerImage] = useState("/images/customers/empty.png");
    const [currentCustomerImage, setCurrentCustomerImage] = useState("/images/customers/empty.png");

    const [score, setScore] = useState(0);
    const { message } = useContext(WebSocketContext);

    const customerBaseImages = [
        "/images/customers/customer1.png",
        "/images/customers/customer2.png",
        "/images/customers/customer3.png",
        "/images/customers/customer4.png",
        "/images/customers/customer5.png"
    ];

    useEffect(() => {
        if (!message) return;
        const data = message.content.data;

        switch (data.type) {
            case "game_state":
                if (data.game_state_update_type === "new_order") {
                    const burger = data.order.burger?.ingredients ?? [];
                    const drink = data.order.drink ?? null;
                    const side = data.order.fry ? { tableState: "fries" } : null;

                    setBurgerOrder(burger);
                    setDrinkOrder(drink);
                    setSideOrder(side);

                    const randIndex = Math.floor(Math.random() * customerBaseImages.length);
                    const randomCustomer = customerBaseImages[randIndex];

                    setBaseCustomerImage(randomCustomer);
                    setCurrentCustomerImage(randomCustomer);
                }
                break;
        }
    }, [message]);

    useEffect(() => {
        if (baseCustomerImage && !baseCustomerImage.includes("_think")) {
            const timer = setTimeout(() => {
                const thinkVersion = baseCustomerImage.replace(".png", "_think.png");
                setCurrentCustomerImage(thinkVersion);
            }, 2900);
            return () => clearTimeout(timer);
        }
    }, [baseCustomerImage]);

    const addSelectedItem = (item) => {
        setSelectedItems((prev) => [...prev, item]);
    };
    const removeSelectedItem = (indexToDelete) => {
        setSelectedItems((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    };
    const clearAllSelected = () => {
        setSelectedItems([]);
    };

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
            if (JSON.stringify(burger) === JSON.stringify(burgerOrder)) {
                tempScore += 2;
            }
        }
        if (side) {
            tempScore += 1;
            if (side === 'fries') {
                tempScore += 2;
            }
        }
        if (drink) {
            tempScore += 2;
            const drinkObj = { color: null, fillPercentage: 100, hasIce: false, cupSize: null };
            if (JSON.stringify(drink) === JSON.stringify(drinkObj)) {
                tempScore += 2;
            }
        }

        setScore(score + tempScore);
    };

    const handleGiveToCustomer = () => {
        const tempBurger = employeeBurger;
        const tempSide = employeeSide?.tableState;
        const tempDrink = employeeDrink;

        getScoring({ burger: tempBurger, side: tempSide, drink: tempDrink });

        setEmployeeBurger(null);
        setEmployeeSide(null);
        setEmployeeDrink(null);
    };

    return (
        <div className="app-container">
            <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
            {(() => {
                switch (selectedRole) {
                    case "manager":
                        return (
                            <>
                                <div className="columns">
                                    <div className="column">
                                        <MiniOrderDisplay burger={burgerOrder} side={sideOrder} drink={drinkOrder} />
                                    </div>
                                    <div className="column">
                                        <p className='Score'>Your score is ${score}</p>
                                        <AACBoard
                                            selectedItems={selectedItems}
                                            onSelectItem={addSelectedItem}
                                            onDeleteItem={removeSelectedItem}
                                            onClearAll={clearAllSelected}
                                            onPlayAll={onPlayAll}
                                            customerImage={currentCustomerImage}
                                            burgerOrder={burgerOrder}
                                            drinkOrder={drinkOrder}
                                            hasSide={!!sideOrder}
                                            hasIce={false}
                                            drinkSize={"medium"}
                                            orderVisible={true}
                                        />
                                        <MiniOrderDisplay burger={employeeBurger} side={employeeSide} drink={employeeDrink} />
                                        {(employeeBurger || employeeDrink || employeeSide) && (
                                            <ManagerActions onGiveToCustomer={handleGiveToCustomer} />
                                        )}
                                    </div>
                                </div>
                            </>
                        );
                    case "burger":
                        return <BurgerBuilder onSend={setEmployeeBurger} score={score} />;
                    case "side":
                        return <SideBuilder onSend={setEmployeeSide} score={score} />;
                    case "drink":
                        return <DrinkBuilder onSend={setEmployeeDrink} score={score} />;
                }
            })()}
        </div>
    );
};

export default App;
