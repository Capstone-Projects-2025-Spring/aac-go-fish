import React, {useContext, useState} from "react";
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
import { useWebSocket, WebSocketContext } from "./WebSocketContext";

const App = () => {
    const {send} = useContext(WebSocketContext);

    const [selectedRole, setSelectedRole] = useState("manager");
    const [employeeBurger, setEmployeeBurger] = useState(null);
    const [employeeSide, setEmployeeSide] = useState(null);
    const [employeeDrink, setEmployeeDrink] = useState(null);

    const [burgerOrder, setBurgerOrder] = useState([]);
    const [sideOrder, setSideOrder] = useState(null);
    const [drinkOrder, setDrinkOrder] = useState(null);

    const [isGameCompleteModalOpen, setIsGameCompleteModalOpen] = useState(false);
    const [isDayCompleteModalOpen, setIsDayCompleteModalOpen] = useState(false);

    const [score, setScore] = useState("$0.00");
    const [dayScore, setDayScore] = useState("$0.00");
    const [day, setDay] = useState(1);
    const [dayCustomers, setDayCustomers] = useState(0);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const [customerIndex, setCustomerIndex] = useState(-1);


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
                        const burger = data.order.burger?.ingredients ?? [];
                        const drink = data.order.drink ?? null;
                        const side = data.order.side ?? null;

                        setBurgerOrder(burger);
                        setDrinkOrder(drink);
                        setSideOrder(side);

                        setCustomerIndex((customerIndex + 1) % 10);

                        break;
                    case "day_end":
                        const dayScore = data.score ?? 0;
                        setDayScore(formatter.format(dayScore / 100));
                        setDayCustomers(data.customers_served)

                        setDay(data.day ?? 0);

                        setIsDayCompleteModalOpen(true);
                        setTimeout(() => {
                            setIsDayCompleteModalOpen(false);
                        }, 10000)
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
                        break;
                    case "order_score":
                        setScore(data.score);
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

    const handleGiveToCustomer = () => {
        send({
            data: {
                type: "game_state", game_state_update_type: "order_submission", order: {
                    burger: {
                        ingredients: employeeBurger
                    }, drink: employeeDrink, side: employeeSide
                }
            }
        });

        setEmployeeBurger(null);
        setEmployeeDrink(null);
        setEmployeeSide(null);
    };

    function MainScreen({ role }) {
        switch (role) {
            case "manager":
                return <>
                    <img src={`images/customers/${customerIndex}.png`}
                         alt={`Customer ${customerIndex}`}/>
                    <MiniOrderDisplay burger={burgerOrder} drink={drinkOrder} side={sideOrder}/>
                    <MiniOrderDisplay burger={employeeBurger} drink={employeeDrink} side={employeeSide}/>
                    <AACBoard/>
                    <button className="send-order" onClick={handleGiveToCustomer}>
                        Send Order
                    </button>
                </>;
            case "burger":
                return <BurgerBuilder/>;
            case "side":
                return <SideBuilder/>;
            case "drink":
                return <DrinkBuilder/>;
            default:
                return <HomePage/>;
        }
    }

    return <div className="app-container">
        {isGameCompleteModalOpen && <GameCompleteModal score={score}/>}
        {isDayCompleteModalOpen && <DayCompleteModal score={dayScore} customers={dayCustomers} handleClick={() => setIsDayCompleteModalOpen(false)}/>}
        <Score score={score} day={day}/>
        <MainScreen role={selectedRole}/>

    </div>;
};

export default App;
