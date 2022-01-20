import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Question } from "../../components";

import "./style.css"

const Game = () => {
    const [ question, setQuestion ] = useState()
    const [ questionList, setQuestionList ] = useState([])
    const [ countdown, setCountdown ] = useState(10)
    const [ questionNum, setQuestionNum ] = useState(0)
    const [ isFinished, setIsFinished ] = useState(false)
    const [ results, setResults ] = useState(null);
    const [ correctIndex, setCorrectIndex ] = useState()
    const [ playing, setPlaying ] = useState(true)
    const [ isSubmitted, setIsSubmitted ] = useState(false)
    const [ player, setPlayer ] = useState(null);
    const [ players, setPlayers ] = useState();
    const [ score, setScore ] = useState(0);
    const [ uploadCount, setUploadCount ] = useState(-1);

    const socket = useSelector(state => state.socket);

    const startGame = () => {

        // host finished loading game
        socket.on("finished-loading", ({ lobby, players, currentPlayer, questions }) => {
            // start the game
            socket.emit("host-start-game", { lobby, questions });
            setPlayer(currentPlayer);
            setPlayers(players);
            setQuestionList(questions);
            setQuestion(questions[0]);
        });
    }

    const gameInProgress = () => {
        // set the countdown from the socket server
        socket.on("counter", ({ count }) => {
            setCountdown(count);
        });
        
        socket.on("new-round", ({ currentRound, currentQuestion }) => {
            console.log("current round: " + currentRound);
            console.log(currentQuestion);
            setQuestionNum(currentRound);
            setQuestion(currentQuestion)
        });

        socket.on("game-finished", () => {
            console.log("game finished");
            setIsFinished(true);
            setQuestionNum(0);
            setUploadCount(0);
        });
    }

    useEffect(() => {
        socket.on("upload-done", () => {
            console.log("upload done");
            setUploadCount(uploadCount => uploadCount++);
        });
    }, [])

    useEffect(() => {
        startGame();
        gameInProgress();
        // Disconnect socket when component unmounts
        return () => {
            socket.disconnect();
        }
    }, []);

    useEffect(() => {
        if (isFinished) {
            console.log("game has finished");
            setPlaying(false);
            socket.emit("upload-score", { player: player, score: score, rounds: questionList.length });
        } else {
            setIsSubmitted(false)
            setCorrectIndex(Math.floor(Math.random() * 4))
            console.log(score)
        }
    }, [questionNum])
    
    return (
        <div id="game-container">
            {/* <p>game id: {0}</p> */}
            { playing &&
                <>
                    <p>Time remaining: {countdown} seconds</p>
                    <h2>Question {questionNum}</h2>
                    {/* { question && <p className="category">Category: {question.category}</p> } */}
                    { question && 
                        <>
                            { !isSubmitted && 
                                <Question
                                    questionData={question}
                                    correctIndex={correctIndex}
                                    toggleSubmitted={setIsSubmitted}
                                    updateScore={setScore}
                                />
                            }
                            { isSubmitted && 
                                <div className="waiting-p">
                                    <p>Waiting...</p>
                                </div> 
                            }
                        </>
                    }
                </>
            }
            { !playing && 
                <>
                    { !results && <p>Calculating scores...</p> }
                    { results && 
                        <button>
                            <Link to="/results" state={{scores: results, questions: questionList.length}}> {/* CHECK QUESTION NUM */}
                                See results
                            </Link>
                        </button>
                    }
                </>
            }
        </div>
    )
}

export default Game;