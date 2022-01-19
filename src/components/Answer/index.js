import React from "react";

import "./style.css"

const Answer = ({answer, index, correct, letter, handleCorrect}) => {
    return (
        <div className="answer-div">
            <input
                type="radio"
                name="answer"
                value={answer} 
                id={"answer" + (index + 1)} 
                onClick={() => handleCorrect(correct)}
                required
            />
            <label htmlFor={"answer" + (index + 1)} className="answer">{letter}) {answer}</label>
        </div>
    )
}

export default Answer