import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Question } from "../../components"

import "./style.css"

const Game = () => {
    const [ question, setQuestion ] = useState()
    const [ questionList, setQuestionList ] = useState({})
    const [ countdown, setCountdown ] = useState(10)
    // const [ timeLimit, setTimeLimit ] = useState()
    const [ questionNum, setQuestionNum ] = useState(0)
    const [ isFinished, setIsFinished ] = useState(false)
    const [ results, setResults ] = useState(null);
    const [ correctIndex, setCorrectIndex ] = useState()
    const [ playing, setPlaying ] = useState(true)
    const [ isSubmitted, setIsSubmitted ] = useState(false)
    const [ player, setPlayer ] = useState()
    const [ score, setScore ] = useState(0)

    const name = useSelector(state => state.user.name);
    const lobbyId = useSelector(state => state.user.lobbyId);
    const isHost = useSelector(state => state.user.isHost);
    const category = useSelector(state => state.lobby.category);
    const socket = useSelector(state => state.socket);

    // question = {
    //     category: "Mythology",
    //     type: "multiple",
    //     difficulty: "medium",
    //     question: "The Hippogriff, not to be confused with the Griffon, is a magical creature with the front half of an eagle, and the back half of what?",
    //     correct_answer: "A Horse",
    //     incorrect_answers: [
    //     "A Dragon",
    //     "A Tiger",
    //     "A Lion"
    //     ]
    // }

    const GameInProgress = () => {

        // host finished loading game
        socket.on("finished-loading", ({ lobby, players, currentPlayer, questions }) => {
            // start the game
            socket.emit("host-start-game", { lobby, questions });
            // const { id, time } = lobby;
            // setCountdown(time)
            // setTimeLimit(time)
            setPlayer(currentPlayer.username);
            setQuestionList(questions)
            setQuestion(questions[0])
        });

        // set the countdown from the socket server
        socket.on("counter", ({ count }) => {
            setCountdown(count);
        });
        
        socket.on("new-round", () => {
            // TODO cycle to next question
            setQuestionNum(questionNum + 1)
            setQuestion(questionList[questionNum])
        });

        socket.on("game-finished", () => {
            setIsFinished(true)
        });

        socket.on("scores", ({ scores }) => {
            setResults(scores)
        })
    }

    // // countdown moved to io server side
    // useEffect(() => {
    //     const cycle = () => {
    //         setCountdown(countdown - 1)
    //         if (countdown === 0) {
    //             setIsSubmitted(true)
    //             socket.emit("round-done", {questionNum: questionNum})
    //         }
	// 	};
	// 	const int = setInterval(cycle, 1000);
	// 	return () => clearInterval(int);
    // })

    useEffect(() => {
        GameInProgress();
        // Disconnect socket when component unmounts
        return () => {
            socket.disconnect();
        }
    }, []);

    useEffect(() => {
        if (isFinished) {
            setPlaying(false)
            setScore(score => score / (questionList.length)) //CHECK THAT QUESTION NUM IS CORRECT
            socket.emit("player-score", {username: player, score: score })
        } else {
            // setCountdown(timeLimit)
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
                    <h2>Question {questionNum + 1}</h2>
                    { question && <p>Category: {question.category}</p> }
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
                                <div className="question-div">
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