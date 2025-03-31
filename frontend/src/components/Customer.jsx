import React from "react";

export default function Customer({ customerImage }) {
    return (
        <div>
            <img
                src={customerImage}
                alt="Customer"
                className="manager-image"
            />
        </div>
    );
}