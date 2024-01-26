//TO DO 35:25 in https://www.youtube.com/watch?v=UX5HIrxbRUc
import { useState } from 'react';
const Quiz = ({ questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answerIdx, setAnswerIdx]= useState(null);
    const [answer, setAnswer]= useState(null);

    const { question, choices, correctAnswer } = questions[currentQuestion];

    const onAnswerClick = (answer, index) => {
        setAnswerIdx(index);
        if (answer === correctAnswer) {
            setAnswer(true)
        }
        else {
            setAnswer(false)
        }
    } 
    return (
        <div className="quiz-outer">
            <div className="quiz-container">
                <>
                    <span className = "active-question-no">{ currentQuestion + 1 }</span>
                    <span className = "total-question">/{questions.length}</span>
                    <h2>{question}</h2>
                    <ul>
                        {choices.map((answer, index) => (
                            <li 
                                key={answer}
                                onClick={() => onAnswerClick(answer, index)}
                                className={answerIdx === index ? 'selected-answer' : null}>
                                {answer}
                            </li>
                        ))}
                    </ul>
                </>
            </div>
        </div>
    )
}

export default Quiz;