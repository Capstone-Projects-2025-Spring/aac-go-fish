import React, {useContext, useEffect, useState} from "react";
import "./App.css";
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";
import SideBuilder from "./components/SideBuilder";
import RoleSelector, {Roles} from "./components/RoleSelector";
import AACBoard from "./components/AACBoard";
import ManagerActions from "./components/ManagerActions";
import MiniOrderDisplay from "./components/MiniOrderDisplay";
import { WebSocketContext } from "./WebSocketContext";
import { useCustomerImages } from "./useCustomerImages";
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
    const [score, setScore] = useState(0);
    const [day, setDay] = useState(0);
    const { customerImage, setRandomCustomerImage } = useCustomerImages();
    const { message, send } = useContext(WebSocketContext);

    useEffect(() => {
        if (!message) return;
        const data = message.content.data;
        console.log(data);
        switch (data.type) {
            case "game_state":
                switch (data.game_state_update_type) {
                    case "new_order":
                        const burger = data.order.burger?.ingredients ?? [];
                        const drink = data.order.drink ?? null;
                        const side = data.order.fry ? { tableState: "fries" } : null; // TODO: update when backend sends more sides

                        setBurgerOrder(burger);
                        setDrinkOrder(drink);
                        setSideOrder(side);
                        setRandomCustomerImage();
                        break;
                    case "day_end":
                        const day = data.day ?? 0;

                        setDay(day);
                }
                break;
        }
    }, [message]);

    useEffect(() => console.log(employeeBurger), [employeeBurger]);


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
        if (selectedItems.length === 0) {
            console.log("Manager: No phrase to play!")
            return;
        }

        const names = selectedItems.map((item) => item.name).join(", ");
        console.log(`Manager: Playing phrase: ${names}`);

        for (const item of selectedItems) {
            if (item.audio) {
                const audio = new Audio(item.audio);
                await new Promise((resolve) => {
                    audio.play()
                        .then(() => {
                            console.log(`Manager: Playing ${item.audio}`);
                            audio.onended = resolve;
                        }, () => {
                            console.log(`Manager: Failed to play ${item.audio} (Does the file exist?)`);
                            resolve();
                        })
                });
            }
        }

        console.log("Manager: Played phrase!");
    };

    const getScoring = ({ burger, side, drink }) => {
        // Temporarily scoring function while no scoring in backend
        let tempScore = 0

        if (burger) {
            // 3 points for submitting any burger, +2 points if correct
            tempScore += 3
            console.log(employeeBurger);
            console.log(burgerOrder);
            if (JSON.stringify(burger) === JSON.stringify(burgerOrder)) {
                tempScore += 2
                console.log(`Manager: Burger order is correct`)
            } else {
                console.log(`Manager: Burger order is incorrect`)
            }
        }
        if (side) {
            // 1 point for submitting any side, +2 points if correct
            tempScore += 1
            if (side === 'fries') {
                tempScore += 2
                console.log(`Manager: Side order is correct`)
            } else {
                console.log(`Manager: Side order is incorrect`)
            }
        }
        if (drink) {
            // 2 points for submitting any drink, +2 points if correct
            tempScore += 2

            // Test object, fill and ice are hardcoded for now
            const drinkObj = { color: null, fillPercentage: 100, hasIce: false, cupSize: null }
            if (JSON.stringify(drink) === JSON.stringify(drinkObj)) {
                tempScore += 2
                console.log(`Manager: Drink order is correct`)
            } else {
                console.log(`Manager: Drink order is incorrect`)
            }
        }
        console.log(`Score is ${tempScore}`)
        setScore(score + tempScore)
    }
    const handleGiveToCustomer = () => {
        console.log("Manager: Sending order to the customer");

        let tempBurger = null;
        let tempSide = null;
        if (employeeBurger) {
            tempBurger = employeeBurger;
            console.log(`Sending burger (${tempBurger})`)
        }
        if (employeeSide) {
            tempSide = employeeSide.tableState
            console.log(`Sending side (${employeeSide.tableState})`)
        }
        if (employeeDrink) {
            console.log(`Sending drink (${employeeDrink})`)
        }

        // Temporarily score function while no scoring in backend
        getScoring({ burger: tempBurger, side: tempSide, drink: employeeDrink })

        // send order to backend
        send({data: {
            type: "game_state",
            game_state_update_type: "order_submission",
            order: {
                burger: null,
                fry: null, // TODO: update to side
                drink: null
        }}});

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
                                            <MiniOrderDisplay burger={burgerOrder} side={sideOrder} drink={drinkOrder}/>
                                            <Customer customerImage={customerImage} />
                                        </div>
                                        <div className="column">
                                            <p className='Score'>Day {day} | ${score}</p>
                                            <AACBoard
                                                selectedItems={selectedItems}
                                                onSelectItem={addSelectedItem}
                                                onDeleteItem={removeSelectedItem}
                                                onClearAll={clearAllSelected}
                                                onPlayAll={onPlayAll}
                                                customerImage={customerImage}
                                            />
                                            <MiniOrderDisplay burger={employeeBurger} side={employeeSide} drink={employeeDrink} />
                                            {(employeeBurger || employeeDrink || employeeSide) && (<ManagerActions onGiveToCustomer={handleGiveToCustomer}/>)}
                                        </div>
                                    </div>
                                </>
                            );
                        case "burger":
                            return <BurgerBuilder onSend={setEmployeeBurger} score={score}/>;
                        case "side":
                            return <SideBuilder onSend={setEmployeeSide} score={score}/>;
                        case "drink":
                            return <DrinkBuilder onSend={setEmployeeDrink} score={score}/>;
                    }
                })()}
            </div>
    );
}



export default App;
