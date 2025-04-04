import React from "react";

export default function DrinkDisplay({ color, fillPercentage, hasIce, cupSize, cupPosition }) {
    const cupImages = {
        small: "/images/cup-small.png",
        medium: "/images/cup-medium.png",
        large: "/images/cup-large.png",
    };
    return (
        <div
            className={`CupContainer ${cupSize}`}
            style={{ transform: `translateX(${cupPosition}px)`, transition: "transform 0.4s ease-in-out" }}>
            <div
                className="FillOverlay"
                style={{
                    height: `${fillPercentage}%`,
                    backgroundColor: color,
                }}
            ></div>

            <img src={`/images/cup-${cupSize}.png`} alt="Cup" className="CupImages" />
        </div>
    );
}
