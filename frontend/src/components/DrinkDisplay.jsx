import React from "react";

export default function DrinkDisplay({ color, fillPercentage, hasIce, cupSize }) {
    const cupHeight = {
        small: "200px",
        medium: "275px",
        large: "350px",
    };
    return (
        <div className="Cup" style={{height: cupHeight[cupSize]}}>
            <div className="Filling"
                 style={{
                     backgroundColor: color || "#FFFFFF",
                     height: `${fillPercentage}%`,
                 }}
            ></div>

            {hasIce && (
                <img
                    src="/images/ice.png"
                    alt="Ice"
                    className="Ice"
                />
            )}
        </div>
    );
}
