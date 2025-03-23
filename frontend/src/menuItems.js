function nameToItem(name, index) {
    const key = name.toLowerCase().replace(' ', '_');
    return {
        id: index,
        name,
        image: `/images/${key}.png`,
        audio: `/audio/${key}.mp3`
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
            "Fries"
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
].map(
    (category, index) =>
        ({
            parent: nameToItem(category.name, index),
            children: category.children.map(nameToItem)
        })
);
