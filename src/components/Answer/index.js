import React from "react";

import "./style.css"

const Answer = ({answer, index, correct, handleCorrect}) => {
    return (
        <div className="answer">
            <input
                type="radio"
                name="answer"
                value={answer} 
                id={"answer" + (index + 1)} 
                onClick={() => handleCorrect(correct)}
            />
            <label htmlFor={"answer" + (index + 1)}>{answer}</label>
        </div>
    )
}

export default Answer