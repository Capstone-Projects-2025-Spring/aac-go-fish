import BurgerDisplay from "./BurgerDisplay";

export default function BurgerStation({ imagePaths }) {
    return (
        <div className="BurgerStation">
            <img
                className="GrillImage"
                src="/images/kitchen.png"
                alt="grill station"
            />
            <div className="BurgerStack">
                <BurgerDisplay imagePaths={imagePaths} />
            </div>
        </div>
    );
}
