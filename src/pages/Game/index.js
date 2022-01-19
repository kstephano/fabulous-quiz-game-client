import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Question } from "../../components"

const Game = () => {
    const [ question, setQuestion ] = useState()
    const [ countdown, setCountdown ] = useState(10)
    const [ timeLimit, setTimeLimit ] = useState()
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
        
        socket.on("start-game", ({ lobbyData, players, currentPlayer }) => {
            const { id, time } = lobbyData;
            setCountdown(time)
            setTimeLimit(time)
            setPlayer(currentPlayer.username)
        });
        
        socket.on("new-round", ({ question }) => {
            setQuestion(question)
            setQuestionNum(questionNum + 1)
        });

        socket.on("game-finished", () => {
            setIsFinished(true)
        });

        socket.on("scores", ({ scores }) => {
            setResults(scores)
        })
    }

    useEffect(() => {
        const cycle = () => {
            setCountdown(countdown - 1)
            if (countdown === 0) {
                setIsSubmitted(true)
                socket.emit("round-done", {questionNum: questionNum})
            }
		};
		const int = setInterval(cycle, 1000);
		return () => clearInterval(int);
    })

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
            setScore(score => score / (questionNum + 1)) //CHECK THAT QUESTION NUM IS CORRECT
            socket.emit("player-score", {username: player, score: score })
        } else {
            setCountdown(timeLimit)
            setIsSubmitted(false)
            setCorrectIndex(Math.floor(Math.random() * 4))
            console.log(score)
        }
    }, [questionNum])
    
    return (
        <div id="game-container">
            <p>game id: {0}</p>
            { playing &&
                <>
                    <p>Time remaining: {countdown} seconds</p>
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
                            { isSubmitted && <p>Waiting...</p> }
                        </>
                    }
                </>
            }
            { !playing && 
                <>
                    { !results && <p>Calculating scores...</p> }
                    { results && 
                        <button>
                            <Link to="/results" state={{scores: results, questions: questionNum + 1}}> {/* CHECK QUESTION NUM */}
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