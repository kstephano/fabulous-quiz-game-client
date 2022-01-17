import React, { useState } from "react";
import {Answer} from ".."

const Question = ({questionData, correctIndex, toggleSubmitted, updateScore}) => {
    const [ isCorrect, setIsCorrect ] = useState(false)

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
            key={index}
        />
    )

    const handleSubmit = e => {
        e.preventDefault();
        console.log(isCorrect);
        if (isCorrect) {
            updateScore(score => score + 1)
        }
        toggleSubmitted(true)
    }

    return (
        <div className="question">
            <p>{questionData.question}</p>
            <form onSubmit={handleSubmit}>
                {answerOptions}
                <input type="submit" value="Submit answer"/>
            </form>
        </div>
    );
}

export default Question