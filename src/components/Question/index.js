import React from "react";
import {Answer} from ".."

const Question = ({questionData, correctIndex}) => {
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
            key={index}
        />
    )

    return (
        <div className="question">
            <p>{questionData.question}</p>
            {answerOptions}
        </div>
    );
}

export default Question