export default function SideDisplay({ tableState, fryTimeLeft }) {
    return (<div className="Table">
        {tableState === "empty" && <p>Table is empty</p>}
        {tableState === "potatoes" && (<img src="/images/potato.png" alt="Potato" className="TableImages"/>)}
        {tableState === "onions" && (<img src="/images/onion.png" alt ="Onions" className="TableImages"/>)}
        {tableState === "choppedPotatoes" && (
            <img src="/images/choppedPotatoes.png" alt="ChoppedPotatoes" className="TableImages"/>)}
        {tableState === "choppedOnions" && (
            <img src="/images/OnionSide.png" alt="ChoppedOnions" className="TableImages"/>)}
        {tableState === "frying" && (
            <>
                <img src="/images/fryer.png" alt="Frying" className="TableImages"/>
                <p>Time left: {fryTimeLeft} seconds</p>
            </>
        )}
        {tableState === "fries" && (<img src="/images/fries.png" alt="Fries" className="TableImages"/>)}
        {tableState === "onionRings" && (<img src="/images/OnionRings.png" alt="OnionRings" className="TableImages"/>)}
    </div>)
}
