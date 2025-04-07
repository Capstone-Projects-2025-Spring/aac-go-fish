export default function SideDisplay({ tableState, fryTimeLeft, onDragStart }) {
    return (<div className="Table">
        {tableState === "empty" && <p>Table is empty</p>}
        {tableState === "potatoes" && (<img src="/images/potato.png" alt="Potato" className="TableImages" />)}
        {tableState === "onions" && (<img src="/images/onion.png" alt="Onions" className="TableImages" />)}
        {tableState === "cheese" && (<img src="/images/cheese.png" alt="Cheese" className="TableImages" />)}
        {tableState === "choppedPotatoes" && (
            <div
                className="DraggableItem"
                draggable="true"
                onDragStart={(event) => onDragStart(event, "choppedPotatoes")}
            >
                <img src="/images/choppedPotatoes.png" alt="ChoppedPotatoes" className="TableImages" />
            </div>
        )}
        {tableState === "choppedOnions" && (
            <div
                className="DraggableItem"
                draggable="true"
                onDragStart={(event) => onDragStart(event, "choppedOnions")}
            >
                <img src="/images/onion_side.png" alt="ChoppedOnions" className="TableImages" />
            </div>
        )}
        {tableState === "choppedCheese" && (
            <div
                className="DraggableItem"
                draggable="true"
                onDragStart={(event) => onDragStart(event, "choppedCheese")}
            >
                <img src="/images/cheese_side.png" alt="ChoppedCheese" className="TableImages" />
            </div>
        )}
        {tableState === "frying" && (
            <>
                <p>Time left: {fryTimeLeft} seconds</p>
            </>
        )}
        {tableState === "fries" && (<img src="/images/fries.png" alt="Fries" className="TableImages" />)}
        {tableState === "onionRings" && (<img src="/images/onion_rings.png" alt="Onion Rings" className="TableImages" />)}
        {tableState === "mozzarellaSticks" && (<img src="/images/mozzarella_sticks.png" alt="Mozzarella Sticks" className="TableImages" />)}
    </div>)
}
