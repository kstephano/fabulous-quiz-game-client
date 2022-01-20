import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';

import "./style.css"

const Results = () => {
    const [ results, setResults ] = useState([]);
    const location = useLocation();
    const lobbyId = location.state.lobbyId;
    const numOfQuestions = location.state.rounds;
    console.log(results);
    console.log(lobbyId);

    useEffect(() => {
        console.log(lobbyId);
        axios
            .get(`http://localhost:3000/users/${lobbyId}`)
            .then(response => {
                const data = response.data.users;
                const userResults = data.map((user) => (
                    { username: user.username, score: user.score / 100 * numOfQuestions }
                ));
                setResults(userResults);
            });
    }, []);

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

    // const results = scores.map((score, index) => {
    //     <div key={index} className={position(index + 1) + " result-item"}>
    //         <p>{index + 1}</p>
    //         <p>{score.username}</p>
    //         <p>{Math.ceiling(score.score * questions / 100)}/{questions} <span className="percentage-score">({score.score}%)</span></p>
    //     </div>
    // })
    const lobbyResults = results.map((user, index) => {
        return (
            <div key={index} className={position(index + 1) + " result-item"}>
                <p>{index + 1}</p>
                <p>{user.username}</p>
                <p>{user.score}/{numOfQuestions}</p>
            </div>
        );
    });

    return (
        <div id="results-container">
            <h2>Results</h2>
            <div className="results">
                {lobbyResults}
            </div>
        </div>
    )
}

export default Results;