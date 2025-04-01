import React, {useContext, useEffect, useState} from "react";
import "./App.css";
import BurgerBuilder from "./components/BurgerBuilder";
import DrinkBuilder from "./components/DrinkBuilder";
import SideBuilder from "./components/SideBuilder";
import RoleSelector from "./components/RoleSelector";
import AACBoard from "./components/AACBoard";
import CustomerOrder from "./components/CustomerOrder";
import ManagerActions from "./components/ManagerActions";
import MiniOrderDisplay from "./components/MiniOrderDisplay";
import { WebSocketContext } from "./WebSocketContext";
import { useCustomerImages } from "./useCustomerImages";
import Customer from "./components/Customer";

const App = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [burger, setBurger] = useState(null);
    const [side, setSide] = useState(null);
    const [drink, setDrink] = useState(null);
    const { message } = useContext(WebSocketContext);
    const [orderVisible, setOrderVisible] = useState(false)
    const [burgerOrder, setBurgerOrder] = useState([]);
    const { customerImage, setRandomCustomerImage } = useCustomerImages()
    const [score, setScore] = useState(0)

    useEffect(() => {
        if (!message) return;
        const data = message.content.data;
        console.log(JSON.stringify(data));
        switch (data.type) {
            case "game_state":
                switch (data.game_state_update_type) {
                    case "new_order":
                        setOrderVisible(true);
                        setBurgerOrder(data.order.burger.ingredients);
                        setRandomCustomerImage();
                        // TODO: sides and drink (backend doesn't send them yet -- check generate_order() in game.py)
                }
        }
    }, [message]);


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
        if (burger) {
            tempBurger = burger.map((ingredient) => ingredient.name)
            console.log(`Sending burger (${JSON.stringify(tempBurger)})`)
        }
        if (side) {
            tempSide = side.tableState
            console.log(`Sending side (${side.tableState})`)
        }
        if (drink) {
            console.log(`Sending drink (${JSON.stringify(drink)})`)
        }

        // Temporarily score function while no scoring in backend
        getScoring({ burger: tempBurger, side: tempSide, drink: drink })

        setBurger(null);
        setSide(null);
        setDrink(null);
    };

    return (
        <div className="app-container">
            <div className="main-layout">
                <div className="sidebar">
                    <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
                </div>
                <div className="main-layout">
                    <div className="stations">
                        {(() => {
                            switch (selectedRole) {
                                case "manager":
                                    return (
                                        <>
                                            <div className="columns">
                                                <div className="column">
                                                    Your score is ${score}
                                                    <AACBoard
                                                        selectedItems={selectedItems}
                                                        onSelectItem={addSelectedItem}
                                                        onDeleteItem={removeSelectedItem}
                                                        onClearAll={clearAllSelected}
                                                        onPlayAll={onPlayAll}
                                                        customerImage={customerImage}
                                                    />
                                                    <MiniOrderDisplay burger={burger} side={side} drink={drink} />
                                                    <ManagerActions onGiveToCustomer={handleGiveToCustomer}/>
                                                </div>
                                                <div className="column">
                                                    <CustomerOrder
                                                        burgerOrder={burgerOrder}
                                                        drinkOrder={[]}
                                                        hasIce={false}
                                                        hasSide={false}
                                                        drinkSize={null}
                                                        orderVisible={orderVisible}
                                                    />
                                                    <Customer customerImage={customerImage} />
                                                </div>
                                            </div>
                                        </>
                                    );
                                case "burger":
                                    return <BurgerBuilder onSend={setBurger} />;
                                case "side":
                                    return <SideBuilder onSend={setSide} />;
                                case "drink":
                                    return <DrinkBuilder onSend={setDrink} />;
                            }
                        })()}
                    </div>
                </div>

            </div>
        </div>
    );
}



export default App;
