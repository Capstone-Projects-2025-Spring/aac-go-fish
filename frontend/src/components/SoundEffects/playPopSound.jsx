export const playPopSound = () => {
    const pop = new Audio("/audio/pop.mp3");
    pop.volume = 0.2;
    pop.play();
};
