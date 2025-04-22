export default function SideDisplay({ tableState, fryTimeLeft, onDragStart, manager }) {
    return (<div className="Table" style={{ ...(manager && { width: '5rem' }) }}>
        {tableState === "empty" && <p>Table is empty</p>}
        {tableState === "potatoes" && (<img src="/images/aac_icons/potato.png" alt="Potato" className="TableImages" />)}
        {tableState === "onions" && (<img src="/images/aac_icons/onion.png" alt="Onions" className="TableImages" />)}
        {tableState === "cheese" && (<img src="/images/food_side_view/Mozzarella.png" alt="Cheese" className="TableImages" />)}
        {tableState === "choppedPotatoes" && (
            <div
                className="DraggableItem"
                draggable="true"
                onDragStart={(event) => onDragStart(event, "choppedPotatoes")}
            >
                <img src="/images/station_specific/choppedPotatoes.png" alt="ChoppedPotatoes" className={`TableImages ${tableState}-img`} />
            </div>
        )}
        {tableState === "choppedOnions" && (
            <div
                className="DraggableItem"
                draggable="true"
                onDragStart={(event) => onDragStart(event, "choppedOnions")}
            >
                <img src="/images/food_side_view/slicedOnion.png" alt="ChoppedOnions" className={`TableImages ${tableState}-img`} />
            </div>
        )}
        {tableState === "choppedCheese" && (
            <div
                className="DraggableItem"
                draggable="true"
                onDragStart={(event) => onDragStart(event, "choppedCheese")}
            >
                <img src="/images/food_side_view/SlicedMozzarella.png" alt="ChoppedCheese" className={`TableImages ${tableState}-img`} />
            </div>
        )}
        {tableState === "frying" && (
            <>
                <p>Time left: {fryTimeLeft} seconds</p>
            </>
        )}
        {tableState === "fries" && (<img src="/images/aac_icons/fries.png" alt="Fries" className="TableImages" style={{
            transform: 'scale(0.8)',
            position: 'relative',
            top: '-1.5rem',
        }} />)}
        {tableState === "onionRings" && (<img src="/images/aac_icons/OnionRings.png" alt="OnionRings" className="TableImages" />)}
        {tableState === "mozzarellaSticks" && (<img src="/images/aac_icons/mozzarella_sticks.png" alt="Mozzarella Sticks" className="TableImages" />)}
    </div>)
}
