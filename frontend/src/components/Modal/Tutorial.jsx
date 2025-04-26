import "./Tutorial.css"
import {useEffect, useState} from "react";
import ReactDom from "react-dom";

export default function Tutorial({classNames, audioSourceFolder}) {
    classNames = ["placeholder", ...classNames];
    const [step, setStep] = useState(0);
    const nextStep = () => setStep((prev) => prev + 1);
    const previousStep = () => setStep((prev) => prev - 1);
    const exit = () => setStep(classNames.length);
    useEffect(() => {
        const addHighlight = (className) => {
            Array.from(document.getElementsByClassName(className))
                .forEach(el => el.classList.add('highlighted'));
        };
        const removeHighlight = () => {
            document.querySelectorAll('.highlighted')
                .forEach(el => el.classList.remove('highlighted'));
        };

        removeHighlight();
        const className = classNames[step];
        addHighlight(className);
        if (step !== 0 && step < classNames.length) {
            new Audio(`${audioSourceFolder}/${classNames[step]}.mp3`)?.play();
        }
        return removeHighlight;
    }, [audioSourceFolder, classNames, step]);

    const HelpButton = () => <button className="help" onClick={() => setStep(0)}>?</button>;
    const NextStepButton = () => <button onClick={nextStep}>{step === classNames.length - 1 ? '✓' : '→'}</button>
    const PreviousStepButton = () => {
        if (step === 0) {
            return <button onClick={exit}>✕</button>
        } else {
            return <button onClick={previousStep}>←</button>
        }
    }
    const Controls = () => <span className="controls">
        {<PreviousStepButton/>}
        {<NextStepButton/>}
    </span>
    const Overlay = ({children}) => <div className="modal-overlay">{children}</div>
    const portal = document.getElementById("portal-game");
    const Banner = () => <div className="banner">How to Play</div>;
    const TutorialModal = () => ReactDom.createPortal(<Overlay><Controls/>{step === 0 && <Banner/>}</Overlay>, portal)

    return <>
        <HelpButton/>
        {step < classNames.length && <TutorialModal/>}
    </>
}
