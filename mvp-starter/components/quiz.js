//TO DO  1:18 in https://www.youtube.com/watch?v=UX5HIrxbRUc
import { useState } from 'react';
import { resultInitialState } from '../constants/constants.js'; //resultInitialState from '../constants/constants.js'
import AnswerTimer from './AnswerTimer.jsx';
const Quiz = ({ questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answerIdx, setAnswerIdx]= useState(null);
    const [answer, setAnswer]= useState(null);
    const [result, setResult]= useState(resultInitialState);
    const [showResult, setShowResult]= useState(0);

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

    const onClickNext = () => {
        setAnswerIdx(null);
        setResult(result => 
            answer 
             ? {
                 ...result,
                 score: result.score + 5,
                 correctAnswer: result.correctAnswer + 1
             }
             : {
                 ...result,
                 wrongAnswer: result.wrongAnswer + 1
             }
            );
        if (currentQuestion !== questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1)
        }
        else {
            setCurrentQuestion(0);
            setShowResult(true);
        }
    }

    const onTryAgain = () => {
        setShowResult(false);
        setResult(resultInitialState);
    }
    return (
        <div className="quiz-outer">
            <div className="quiz-container">
                {!showResult ? (<>
                    <AnswerTimer duration={10}/>
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
                    <div className = "footer">
                        <button onClick={onClickNext} disabled={answerIdx === null}>
                            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </>) : 
                    <div className="result">
                        <h3>Result</h3>
                        <p>
                            Total Questions : {questions.length}
                        </p>
                        <p>
                            Total Score : {result.score}
                        </p>
                        <p>
                            Correct Answers : {result.correctAnswer}
                        </p>
                        <p>
                            Wrong Answers : {result.wrongAnswer}
                        </p>
                        <button onClick = {onTryAgain}>Try Again</button>
                    </div>                    
                    }
                
            </div>
        </div>
    )
}

export default Quiz;