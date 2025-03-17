import React from "react";

export default function DrinkDisplay({ layers, hasIce }) {
    return (
        <div className="Cup">
            {layers.map((layer, index) => (
                <div
                    key={index}
                    className="DrinkLayer"
                    style={{backgroundColor: layer.color}}
                >
                </div>
            ))}
            {hasIce && (
                <img
                    src="/images/ice.png"
                    alt="Ice"
                    className="Ice"
                />
            )}
        </div>
    )
}