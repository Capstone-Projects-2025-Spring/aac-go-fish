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

const App = () => {
    const [selectedRole, setSelectedRole] = useState(Roles.MANAGER);
    const [selectedItems, setSelectedItems] = useState([]);
    const [employeeBurger, setEmployeeBurger] = useState(null);
    const [employeeSide, setEmployeeSide] = useState(null);
    const [employeeDrink, setEmployeeDrink] = useState(null);

    const [burgerOrder, setBurgerOrder] = useState([]);
    const [sideOrder, setSideOrder] = useState(null);
    const [drinkOrder, setDrinkOrder] = useState(null);
    const [orderVisible, setOrderVisible] = useState(false);


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
        console.log(message);
        const data = message.content.data;
        switch (data.type) {
            case "game_state":
                switch (data.game_state_update_type) {
                    case "new_order":
                        console.log("new order");
                        const burger = data.order.burger?.ingredients ?? [];
                        const drink = data.order.drink ?? null;
                        const side = data.order.side ?? null; // TODO: update when backend sends more sides

                        setBurgerOrder(burger);
                        setDrinkOrder(drink);
                        setSideOrder(side);

                        const randomCustomer = customerBaseImages[Math.floor(Math.random() * customerBaseImages.length)];
                        setBaseCustomerImage(randomCustomer);
                        setCurrentCustomerImage(randomCustomer);

                        setOrderVisible(false);
                        setTimeout(() => {
                            setOrderVisible(true);
                        }, 3000);
                        break;
                    case "order_component":
                        console.log("order_component");
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
                        }
                }
                break;
        }
    }, [message]);

    useEffect(() => console.log(employeeBurger), [employeeBurger]);

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
            const drinkObj = { color: null, fillPercentage: 100, cupSize: null };
            if (JSON.stringify(drink) === JSON.stringify(drinkObj)) tempScore += 2;
        }

        setScore(score + tempScore);
    };

    const handleGiveToCustomer = () => {
        getScoring({
            burger: employeeBurger,
            side: employeeSide?.tableState,
            drink: employeeDrink,
        });

        setEmployeeBurger(null);
        setEmployeeSide(null);
        setEmployeeDrink(null);
    };
    const handleReceiveOrder = () => {
        console.log("Test button clicked");

        const burger = [
            { name: "Bottom Bun", sideImage: "/images/bottom_bun_side.png" },
            { name: "Patty", sideImage: "/images/patty_side.png" },
            { name: "Lettuce", sideImage: "/images/lettuce_side.png" },
            { name: "Top Bun", sideImage: "/images/top_bun_side.png" },
        ];
        const side = { tableState: "fries" };
        const drink = { color: "#FF0000", fillPercentage: 100, cupSize: "medium" };

        setBurgerOrder(burger);
        setDrinkOrder(drink);
        setSideOrder(side);

        let randomCustomer;
        do {
            randomCustomer = customerBaseImages[Math.floor(Math.random() * customerBaseImages.length)];
        } while (randomCustomer === baseCustomerImage);

        setBaseCustomerImage(randomCustomer);
        setCurrentCustomerImage(randomCustomer);

        setOrderVisible(false);


        const delay = Math.floor(Math.random() * 2000) + 3000;

        setTimeout(() => {
            const thinkVersion = randomCustomer.replace(".png", "_think.png");
            setCurrentCustomerImage(thinkVersion);
            setOrderVisible(true);
            console.log(`Order and thinking bubble visible after ${delay}ms`);
        }, delay);
    };


    return (
        <div className="app-container">
            <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
            {selectedRole === "manager" ? (
                <>
                    <div className="columns">
                        {orderVisible && (
                            <MiniOrderDisplay burger={burgerOrder} side={sideOrder} drink={drinkOrder} />
                        )}                        </div>
                    <div className="column">
                        <p className='Score'>Your score is ${score}</p>
                        <img
                            src={currentCustomerImage ?? "/images/customers/empty.png"}
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
                        <MiniOrderDisplay burger={employeeBurger} side={employeeSide} drink={employeeDrink} />
                        {(employeeBurger || employeeDrink || employeeSide) && (
                            <ManagerActions onGiveToCustomer={handleGiveToCustomer} />
                        )}
                        <button onClick={handleReceiveOrder} className="receive-order-btn">
                            Receive Order
                        </button>
                    </div>

                </>
            ) : selectedRole === "burger" ? (
                <BurgerBuilder score={score} />
            ) : selectedRole === "side" ? (
                <SideBuilder score={score} />
            ) : (
                <DrinkBuilder score={score} />
            )}
        </div>
    );
};

export default App;
