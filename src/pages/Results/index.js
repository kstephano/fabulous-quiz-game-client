import React from "react";
import { useLocation } from "react-router-dom";

const Results = () => {
    const location = useLocation();
    const { scores, questions } = location.state;
    // scores = [{username: "", score: 45}, {...}]

    const position = num => {
        switch (num) {
            case 1:
                return "first";
            case 2:
                return "second";
            case 3:
                return "third";
            default:
                return "unplaced";
        }
    }

    const results = scores.map((score, index) => {
        <div key={index} className={position(index + 1) + " result-item"}>
            <p>{index + 1}</p>
            <p>{score.username}</p>
            <p>{Math.ceiling(score.score * questions / 100)}/{questions} <span className="percentage-score">({score.score}%)</span></p>
        </div>
    })

    return (
        <div id="results-container">
            <h2>Results</h2>
            <div className="results">
                {results}
            </div>
        </div>
    )
}

export default Results;