export default function SideDisplay({ tableState, fryTimeLeft, onDragStart }) {
    return (<div className="Table">
        {tableState === "empty" && <p>Table is empty</p>}
        {tableState === "potatoes" && (<img src="/images/aac_icons/potato.png" alt="Potato" className="TableImages" />)}
        {tableState === "onions" && (<img src="/images/aac_icons/onion.png" alt="Onions" className="TableImages" />)}
        {tableState === "cheese" && (<img src="/images/aac_icons/cheese.png" alt="Cheese" className="TableImages" />)}
        {tableState === "choppedPotatoes" && (
            <div
                className="DraggableItem"
                draggable="true"
                onDragStart={(event) => onDragStart(event, "choppedPotatoes")}
            >
                <img src="/images/station_specific/choppedPotatoes.png" alt="ChoppedPotatoes" className="TableImages" />
            </div>
        )}
        {tableState === "choppedOnions" && (
            <div
                className="DraggableItem"
                draggable="true"
                onDragStart={(event) => onDragStart(event, "choppedOnions")}
            >
                <img src="/images/food_side_view/onion_side.png" alt="ChoppedOnions" className="TableImages" />
            </div>
        )}
        {tableState === "choppedCheese" && (
            <div
                className="DraggableItem"
                draggable="true"
                onDragStart={(event) => onDragStart(event, "choppedCheese")}
            >
                <img src="/images/food_side_view/cheese_side.png" alt="ChoppedCheese" className="TableImages" />
            </div>
        )}
        {tableState === "frying" && (
            <>
                <p>Time left: {fryTimeLeft} seconds</p>
            </>
        )}
        {tableState === "fries" && (<img src="/images/aac_icons/fries.png" alt="Fries" className="TableImages" />)}
        {tableState === "onionRings" && (<img src="/images/aac_icons/OnionRings.png" alt="OnionRings" className="TableImages" />)}
        {tableState === "mozzarellaSticks" && (<img src="/images/aac_icons/mozzarella_sticks.png" alt="Mozzarella Sticks" className="TableImages" />)}
    </div>)
}
