import "./Score.css";

const Score = ({ score, day }) =>{
    return <div className="Score">
        <p className="ScoreText">Day {day} - {score}</p>
    </div>
}

export default Score;
