function nameToParentItem(name) {
    const key = name.toLowerCase().replace(' ', '_');
    return {
        name,
        image: `images/aac_icons/${key}.png`,
        audio: `/audio/${key}.mp3`
    };
}

function nameToChildItem(name, index) {
    const key = name.toLowerCase().replace(' ', '_');
    return {
        name,
        image: `images/aac_icons/${key}.png`,
        audio: `/audio/${key}.mp3`,
        id: index,
        sideImage: `images/food_side_view/${key}_side.png`
    };
}

export const menu = [
    {
        name: "Burger",
        children: [
            "Bottom Bun", "Top Bun", "Patty", "Lettuce",
            "Onion", "Tomato", "Ketchup", "Mustard", "Cheese"
        ],
    },
    {
        name: "Sides",
        children: [
            "Fries", "Onion Rings"
        ],
    },
    {
        name: "Drinks",
        children: [
            "Soda",
            "Blue",
            "Green",
            "Yellow",
            "Red",
            "Orange",
            "Purple",
            "Small",
            "Medium",
            "Large"
        ],
    }
].map(category => ({
    parent: nameToParentItem(category.name),
    children: category.children.map((childName, childIndex) => nameToChildItem(childName, childIndex))
}));

export const menuMap = Object.fromEntries(
    menu.map(({ parent, children }) => [
        parent.name,
        Object.fromEntries([
            ...children.map(child => [child.name, child])
        ])
    ])
);
