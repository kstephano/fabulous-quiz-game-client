import React from "react";

const Answer = ({answer, index, correct, handleCorrect}) => {
    return (
        <div className="answer">
            <input
                type="radio"
                name="answer"
                value={answer} 
                id={"answer" + (index + 1)} 
                // correct={correct ? "correct" : "incorrect"}
                onClick={() => handleCorrect(correct)}
            />
            <label htmlFor={"answer" + index}>{answer}</label>
        </div>
    )
}

export default Answer