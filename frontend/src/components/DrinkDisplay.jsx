import React from "react";

export default function DrinkDisplay({ color, fillPercentage, hasIce, cupSize }) {
    const cupImages = {
        small: "/images/small.png",
        medium: "/images/medium.png",
        large: "/images/large.png",
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

            <img src={cupImages[cupSize]} alt="Cup" className="CupImages" />
        </div>
    );
}
