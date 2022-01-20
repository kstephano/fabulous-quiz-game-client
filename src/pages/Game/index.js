import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Question } from "../../components";

import "./style.css"

const Game = () => {
    const [ question, setQuestion ] = useState()
    const [ questionList, setQuestionList ] = useState([])
    const [ countdown, setCountdown ] = useState(0)
    const [ questionNum, setQuestionNum ] = useState(0)
    const [ isFinished, setIsFinished ] = useState(false)
    const [ correctIndex, setCorrectIndex ] = useState()
    const [ playing, setPlaying ] = useState(true)
    const [ isSubmitted, setIsSubmitted ] = useState(false)
    const [ player, setPlayer ] = useState(null);
    const [ score, setScore ] = useState(0);
    const [ isUploaded, setIsUploaded ] = useState(false);
    const [ lobbyId, setLobbyId ] = useState(0);
    const [ isGameLoaded, setIsGameLoaded ]  = useState(false);

    const navigate = useNavigate();
    const socket = useSelector(state => state.socket);

    const startGame = () => {

        // host finished loading game
        socket.on("finished-loading", ({ lobby, players, currentPlayer, questions }) => {
            setCountdown(lobby.time)
            setPlayer(currentPlayer);
            setLobbyId(lobby.id);
            setQuestionList(questions);
            setQuestion(questions[0]);
            setIsGameLoaded(true);
            // start the game
            socket.emit("host-start-game", { lobby, questions });
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
        });

        socket.on("upload-done", () => {
            console.log("upload done");
            setIsUploaded(true);
        });
    }

    useEffect(() => {
        if (socket === null) {
            console.log(player)
            navigate('/');
        } else {
            startGame();
            gameInProgress();
        }
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
            { !isGameLoaded &&
                <div className="waiting-div">
                    <div className="waiting-p">
                        <p>Loading...</p>
                    </div>
                </div>
            }
            { playing && isGameLoaded &&
                <>
                    <p className="countdown">Time remaining: {countdown} seconds</p>
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
                <div className="waiting-div">
                    { !isUploaded && 
                        <div className="waiting-p">
                            <p>Calculating scores...</p>
                        </div> 
                    }
                    { isUploaded && 
                        <div className="results-button-container">
                            <button className="green-button">
                                <Link
                                    to="/results" 
                                    state={{ lobbyId: lobbyId, rounds: questionList.length }}
                                    className="results-link"
                                >
                                    See results
                                </Link>
                            </button>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Game;