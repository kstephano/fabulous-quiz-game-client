import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Question } from "../../components"

const Game = () => {
    const [ question, setQuestion ] = useState()
    const [ countdown, setCountdown ] = useState(10)
    const [ questionNum, setQuestionNum ] = useState(0)
    const [ correctIndex, setCorrectIndex ] = useState()
    const [ playing, setPlaying ] = useState(true)
    const [ isSubmitted, setIsSubmitted ] = useState(false)
    const [ score, setScore ] = useState(0)
    const [ socket, setSocket ] = useState(null);
    const params = useParams();

    if (socket === null) setSocket(params.socket);

    const questions = [{
        category: "Mythology",
        type: "multiple",
        difficulty: "medium",
        question: "The Hippogriff, not to be confused with the Griffon, is a magical creature with the front half of an eagle, and the back half of what?",
        correct_answer: "A Horse",
        incorrect_answers: [
        "A Dragon",
        "A Tiger",
        "A Lion"
        ]
    },
    {
        category: "Mythology",
        type: "multiple",
        difficulty: "medium",
        question: "Who was the Roman god of fire?",
        correct_answer: "Vulcan",
        incorrect_answers: [
        "Apollo",
        "Jupiter",
        "Mercury"
        ]
    }]

    useEffect(() => {
        const cycle = () => {
			setCountdown(countdown - 1)
            if (countdown === 0) {
                setQuestionNum(questionNum + 1)
            }
		};
		const int = setInterval(cycle, 1000);
		return () => clearInterval(int);
    })

    useEffect(() => {
        // Disconnect socket when component unmounts
        return () => {
        socket.disconnect();
        }
    }, []);

    useEffect(() => {
        if (questionNum === questions.length) {
            setPlaying(false)
        }
        setQuestion(questions[questionNum])
        setCountdown(10)
        setIsSubmitted(false)
        setCorrectIndex(Math.floor(Math.random() * 4))
        console.log(score)
    }, [questionNum])
    
    return (
        <div id="game-container">
            <p>game id: {params.lobbyId}</p>
            { playing &&
                <>
                    <p>Time remaining: {countdown} seconds</p>
                    { questions[questionNum] && <p>Category: {questions[questionNum].category}</p>}
                    { question && !isSubmitted && 
                        <Question
                            questionData={question}
                            correctIndex={correctIndex}
                            toggleSubmitted={setIsSubmitted}
                            updateScore={setScore}
                        />
                    }
                    { question && isSubmitted && 
                         <p>Waiting...</p>   
                    }
                </>
            }
            { !playing && 
                <>
                    <button><Link to="/results">See results</Link></button>
                </>
            }
        </div>
    )
}

export default Game;