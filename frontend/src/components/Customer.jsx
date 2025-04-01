import React from "react";

export default function Customer({ customerImage }) {
    return (
        <img
            src={customerImage}
            alt="Customer"
            className="manager-image"
        />
    );
}
