import React, { useState } from "react";
import ItemButton from "./ItemButton";
import { menu } from "../../menuItems";

export default function ItemGrid({ onClick }) {
    const [openIndex, setOpenIndex] = useState(null);
    const items = menu;

    return (
        <div className="aacboard-grid">
            {openIndex === null ? (
                items.map((item, index) => (
                    <ItemButton
                        key={item.parent.id}
                        item={item.parent}
                        onClick={() => setOpenIndex(index)}
                    />
                ))
            ) : (
                <>
                    <ItemButton
                        item={{
                            id: "back",
                            name: "Back",
                            image: "images/button_icons/back.png"
                        }}
                        onClick={() => setOpenIndex(null)}
                    />
                    {items[openIndex].children.map((child) => (
                        <ItemButton
                            key={child.id}
                            item={child}
                            onClick={() => onClick(child)}
                        />
                    ))}
                </>
            )}
        </div>
    );
}
