import React from "react";

export default function DrinkDisplay({ color, fillPercentage, hasIce, cupSize }) {
    return (
        <div className={`Cup ${cupSize}`}>
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
