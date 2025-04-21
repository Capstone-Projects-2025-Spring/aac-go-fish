import React, {useState} from "react";
import "./App.css";
import BurgerBuilder from "./components/Burger/BurgerBuilder";
import DrinkBuilder from "./components/Drinks/DrinkBuilder";
import SideBuilder from "./components/Sides/SideBuilder";

import HomePage from "./components/HomePage";
import Score from "./components/Score/Score";
import GameCompleteModal from "./components/Modal/GameCompleteModal";
import DayCompleteModal from "./components/Modal/DayCompleteModal";
import {useWebSocket} from "./WebSocketContext";
import Manager from "./components/Manager/Manager";

const App = () => {
    const [selectedRole, setSelectedRole] = useState("side");
    const [employeeOrder, setEmployeeOrder] = useState({
        burger: null, side: null, drink: null,
    });
    const [customerOrder, setCustomerOrder] = useState({
        burger: null, side: null, drink: null,
    });
    const [isGameCompleteModalOpen, setIsGameCompleteModalOpen] = useState(false);
    const [isDayCompleteModalOpen, setIsDayCompleteModalOpen] = useState(false);
    const [score, setScore] = useState("$0.00");
    const [dayScore, setDayScore] = useState("$0.00");
    const [day, setDay] = useState(1);
    const [dayCustomers, setDayCustomers] = useState(0);
    const [customerIndex, setCustomerIndex] = useState(-1);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD'
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
                        break
                    default:
                        break
                }
                break;
            case "game_state":
                switch (data.game_state_update_type) {
                    case "new_order":
                        const burger = data.order.burger?.ingredients;
                        const drink = data.order.drink ?? null;
                        const side = data.order.side ?? null;

                        setCustomerOrder({burger, drink, side})
                        setCustomerIndex((customerIndex + 1) % 10);

                        break;
                    case "day_end":
                        const dayScore = data.score;
                        setDayScore(formatter.format(dayScore / 100));
                        setDayCustomers(data.customers_served)
                        setDay(data.day);
                        setIsDayCompleteModalOpen(true);
                        setTimeout(() => setIsDayCompleteModalOpen(false), 10000)
                        break;
                    case "order_component":
                        switch (data.component_type) {
                            case "burger":
                                setEmployeeOrder({...employeeOrder, burger: data.component.ingredients});
                                break;
                            case "drink":
                                setEmployeeOrder({...employeeOrder, drink: data.component});
                                break;
                            case "side":
                                setEmployeeOrder({...employeeOrder, side: data.component});
                                break;
                            default:
                                console.log(`Unknown component type=${data.component_type}`);
                                break;
                        }
                        break;
                    case "role_assignment":
                        setSelectedRole(data.role);
                        break;
                    case "order_score":
                        const score = data.score;
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

    const playHelpMessage = () => {
        const audio = new Audio(`audio/${selectedRole}_help.mp3`);
        audio.play();
    }

    function HelpButton() {
        return <button className="help" onClick={playHelpMessage}>
            ?
        </button>
    }


    return <div className="app-container">
        {isGameCompleteModalOpen && <GameCompleteModal score={score}/>}
        {isDayCompleteModalOpen && <DayCompleteModal
            score={dayScore}
            customers={dayCustomers}
            handleClick={() => setIsDayCompleteModalOpen(false)}
        />}
        <Score score={score} day={day}/>
        <HelpButton />
            {selectedRole === "manager" && <Manager
                customerIndex={customerIndex}
                customerOrder={customerOrder}
                employeeOrder={employeeOrder}
                setEmployeeOrder={setEmployeeOrder}
            />}
            {selectedRole === "burger" && <BurgerBuilder/>}
            {selectedRole === "side" && <SideBuilder/>}
            {selectedRole === "drink" && <DrinkBuilder/>}
            {!["manager", "burger", "side", "drink"].includes(selectedRole) && <HomePage/>}
    </div>
;
};

export default App;
