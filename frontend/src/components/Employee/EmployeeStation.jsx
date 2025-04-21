import React from "react";

const handleRequestRepeat = () => {
    console.log("Employee requests manager to repeat order...");
    const audio = new Audio("/audio/repeat_order.mp3");
    audio.play().catch((err) => {
        console.error("Audio playback failed:", err);
    });
};

export default function EmployeeStation({ handleSend }) {
    return <>
        <button className="BottomButtons" onClick={handleRequestRepeat}>
            <img src="/images/button_icons/repeat_order.png" className="RepeatOrderImage" alt="Request repeat order"/>
            <p>Repeat Order</p>
        </button>
    </>
}