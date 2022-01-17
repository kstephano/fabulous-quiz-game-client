import React from "react";

const Answer = ({answer, index, correct}) => {
    return (
        <div className="answer">
            <input type="radio" name="answer" value={answer} id={"answer" + index} correct={correct ? "correct" : "incorrect"}/>
            <label htmlFor={"answer" + index}>{answer}</label>
        </div>
    )
}

export default Answer