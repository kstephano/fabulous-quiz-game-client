import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Question } from "../../components"

const Game = () => {
    const [ question, setQuestion ] = useState()
    const [ countdown, setCountdown ] = useState(10)
    const [ questionNum, setQuestionNum ] = useState(0)
    const [ correctIndex, setCorrectIndex ] = useState()

    const navigate = useNavigate()

    const params = useParams();

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
        setQuestion(questions[questionNum])
        setCountdown(10)
        setCorrectIndex(Math.floor(Math.random() * 4))
    }, [questionNum])
    
    if (questionNum === questions.length) {
        navigate("/results")
    }
    
    return (
        <div id="game-container">
            <p>game id: {params.lobbyId}</p>
            <p>Time remaining: {countdown} seconds</p>
            {questions[questionNum] && <p>Category: {questions[questionNum].category}</p>}
            {question && <Question questionData={question} correctIndex={correctIndex}/>}
        </div>
    )
}

export default Game;