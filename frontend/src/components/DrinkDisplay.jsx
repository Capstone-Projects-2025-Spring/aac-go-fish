import React from "react";

export default function DrinkDisplay({ color, fillPercentage, cupSize, cupPosition }) {
    const cupImages = {
        small: "/images/cup-small.png",
        medium: "/images/cup-medium.png",
        large: "/images/cup-large.png",
    };
    const maxFillHeight = cupSize === "small" ? 175 : cupSize === "medium" ? 205 : 235;

    return (
        <div
            className={`CupContainer ${cupSize}`}
            style={{
                transform: `translateX(${cupPosition}px)`,
                transition: "transform 0.4s ease-in-out"
            }}
        >
            <div
                className="FillOverlay"
                style={{
                    height: `${Math.min((fillPercentage / 100) * maxFillHeight, maxFillHeight)}px`,
                    backgroundColor: color ? (typeof color === "string" && color.startsWith("#") ? color : `#${color}`) : "#FFFFFF",
                    maxHeight: `${maxFillHeight}px`
                }}
            ></div>

            <img src={cupImages[cupSize]} alt="Cup" className="CupImages" />
        </div>
    );
}
