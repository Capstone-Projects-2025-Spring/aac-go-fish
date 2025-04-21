import "./Score.css";

const Score = ({ score, day }) =>{
    return <div className="Score">
        <p className="ScoreText">Day {day} - {score}</p>
    </div>
    // score is given in cents, divide by 100 and format
    const formattedScore = formatter.format(score / 100);

    return <p className="ScoreText">Day {day} - {formattedScore}</p>
}

export default Score;
