import React from "react";
import "./DrinkDisplay.css";

export default function DrinkDisplay({ color, fillPercentage, cupSize, cupPosition, mini }) {
    const cupImages = {
        small: "/images/drink_sizes/cup-small.png",
        medium: "/images/drink_sizes/cup-medium.png",
        large: "/images/drink_sizes/cup-large.png",
        S: "/images/drink_sizes/cup-small.png",
        M: "/images/drink_sizes/cup-medium.png",
        L: "/images/drink_sizes/cup-large.png",
    };
    const maxFillHeight = cupSize === "small" ? 5.9 : cupSize === "medium" ? 6.72 : 7.8125;
    return (
        <div
            className={`CupContainer ${cupSize} ${mini ? "mini" : ""}`}
            style={{
                transform: `translateX(${cupPosition}px)`,
                transition: "transform 0.4s ease-in-out"
            }}
        >
            <div
                className={"FillOverlay " + cupSize + "" + (mini ? "mini" : "")}
                style={{
                    height: `${Math.min((fillPercentage / 100) * maxFillHeight, maxFillHeight)}rem`,
                    width: "4.7rem",
                    backgroundColor: color ? (typeof color === "string" && color.startsWith("#") ? color : `#${color}`) : "#FFFFFF",
                    maxHeight: `${maxFillHeight}rem`
                }}

            ></div>

            <img src={cupImages[cupSize]} alt="Cup" className={"CupImages " + cupSize + "" + (mini ? "mini" : "")} />
        </div>
    );
}
