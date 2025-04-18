import "./Score.css";

const Score = ({ score, day }) =>{
    // score is given in cents, divide by 100 and format
    const formattedScore = formatter.format(score / 100);

    return <div className="Score">
        <p className="ScoreText">Day {day} - {formattedScore}</p>
    </div>
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

export default Score;
