import React from "react";

export default function DrinkDisplay({ color, fillPercentage, hasIce, cupSize }) {
    const cupImages = {
        small: "/images/cup-small.png",
        medium: "/images/cup-medium.png",
        large: "/images/cup-large.png",
    };
    return (
        <div className={`CupContainer ${cupSize}`}>
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
