import "./Score.css";

export default function Score({ score, day }) {
    return <p className="ScoreText">Day {day} - {score}</p>
}
