//TO DO  1:18 in https://www.youtube.com/watch?v=UX5HIrxbRUc
import { useState, useEffect } from 'react';
import { resultInitialState } from '../constants/constants.js'; //resultInitialState from '../constants/constants.js'
import AnswerTimer from './AnswerTimer.jsx';
import { app, db } from '../firebase/firebase.js';
import { collection, getDocs, getDoc, updateDoc, doc } from "firebase/firestore";
import { useAuth } from '../firebase/auth';

const Quiz = ({ questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answerIdx, setAnswerIdx]= useState(null);
    const [answer, setAnswer]= useState(null);
    const [result, setResult]= useState(resultInitialState);
    const [showResult, setShowResult]= useState(0);
    const [showStart, setShowStart]= useState(true);
    const [showAnswerTimer, setShowAnswerTimer]= useState(true);
    const { authUser, signOut } = useAuth();

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

    useEffect(() => {
        if (showResult) {
            const docRef = doc(db, 'users', authUser.email);
            const docSnap = getDoc(docRef).then((snapshot) => {
              const currScore = snapshot.data().totalScore;
              updateDoc(docRef, { totalScore: currScore + result.score });
            });
        }
      }, [showResult]);

    const onClickNext = (finalAnswer) => {
        setShowAnswerTimer(false);
        setAnswerIdx(null);
        setResult(result => 
            finalAnswer 
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
            console.log(result)
        }
        setTimeout(() => {
            setShowAnswerTimer(true);
        })
    }

    const onTryAgain = () => {
        setShowResult(false);
        setResult(resultInitialState);
    }

    const handleTimeUp = () => {
        setAnswer(false);
        onClickNext(false);
    }
    return (
        <div className="quiz-outer">
            <div className="quiz-container">
                { showStart ? (
                <div className="start-quiz-container">
                    <h1>Call yourself a Swiftie?</h1>
                    <button className='start-quiz' onClick={() => setShowStart(false)}>Click to play!</button>
                </div>) :
                !showResult ? (<>
                    {showAnswerTimer && <AnswerTimer duration={100} onTimeUp={handleTimeUp}/>}
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
                        <button onClick={() => onClickNext(answer)} disabled={answerIdx === null}>
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
                        {
                            console.log(result)
                        }  
                    </div>             
                    }
                
            </div>
        </div>
    )
}

export default Quiz;