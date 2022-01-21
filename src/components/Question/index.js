import React, { useState } from "react";
import { decodeHtml } from "../../helpers";
import { Answer } from ".."

import "./style.css"

const Question = ({questionData, correctIndex, toggleSubmitted, updateScore}) => {
    const [ isCorrect, setIsCorrect ] = useState(false)
    let lettersArray = ["A", "B", "C", "D"]

    let answersArray = ["", "", "", ""]
    answersArray[correctIndex] = questionData.correct_answer
    for (let i = 1; i < 4; i++) {
        answersArray[(correctIndex + i) % 4] = questionData.incorrect_answers[i - 1]
    }

    const answerOptions = answersArray.map((answer, index) => 
        <Answer 
            answer={answer} 
            index={index}
            correct={index === correctIndex}
            handleCorrect={setIsCorrect}
            letter={lettersArray[index]}
            key={index}
        />
    )

    const handleSubmit = e => {
        e.preventDefault();
        if (isCorrect) {
            updateScore(score => score + 1)
        }
        toggleSubmitted(true)
    }

    return (
        <div className="question-div">
            {/* <p className="category">{questionData.category}</p> */}
            <p className="question">{decodeHtml(questionData.question)}</p>
            <div className="form-container">
                <form onSubmit={handleSubmit} className="answer-form">
                    {answerOptions}
                    <div className="submit-container">
                        <input type="submit" value="Submit answer" className="submit-answer-button"/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Question