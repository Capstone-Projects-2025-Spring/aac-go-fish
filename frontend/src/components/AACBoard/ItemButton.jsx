import {playPopSound} from "../SoundEffects/playPopSound";

export default function ItemButton({ item, onClick }) {
    return (
        <button
            className={"aacboard-item-btn"}
            onClick={() => {playPopSound(); onClick()}}
        >
            <img
                src={item.image}
                alt={item.name}
            />
            {item.name}
        </button>
    );
}
