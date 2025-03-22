export default function ItemButton({ item, onClick }) {
    return (
        <button
            className={"aacboard-item-btn"}
            onClick={onClick}
        >
            <img
                src={item.image}
                alt={item.name}
            />
            {item.name}
        </button>
    );
}
