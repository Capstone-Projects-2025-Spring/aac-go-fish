import "./Tutorial.css"
import {useEffect, useState} from "react";
import ReactDom from "react-dom";

export default function Tutorial({classNames, audioSourceFolder}) {
    const [step, setStep] = useState(0);
    const nextStep = () => {
        setStep((prev) => prev + 1);
    };
    classNames = ["placeholder" , ...classNames];
    const previousStep = () => setStep((prev) => prev - 1);
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

    const HelpButton = () => <button className="help" onClick={() => setStep(1)}>?</button>;
    const NextStepButton = () => <button onClick={nextStep}>{step === classNames.length - 1 ? '✓' : '⮞'}</button>
    const PreviousStepButton = () => <button onClick={previousStep} disabled={step <= 1}>⮜</button>
    const Controls = () => <span className="controls">
        {<PreviousStepButton />}
        {<NextStepButton />}
    </span>
    const Overlay = ({children}) => <div className="modal-overlay">{children}</div>
    const portal = document.getElementById("portal-game");
    const TutorialModal = () => ReactDom.createPortal(<Overlay><Controls /></Overlay>, portal)

    return <>
        <HelpButton/>
        {step < classNames.length && <TutorialModal/>}
    </>
}
