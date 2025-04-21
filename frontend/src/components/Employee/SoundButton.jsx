import { playPopSound } from "../SoundEffects/playPopSound";

export const SoundButton = ({ onClick, children, ...props }) => {
    const handleClick = (e) => {
        playPopSound();
        onClick?.(e);
    };

    return (
        <button onClick={handleClick} {...props}>
            {children}
        </button>
    );
};
