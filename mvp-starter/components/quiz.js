import { useState, useEffect, useRef } from 'react';
import { resultInitialState } from '../constants/constants.js'; //resultInitialState from '../constants/constants.js'
import AnswerTimer from './AnswerTimer.jsx';
import { app, db } from '../firebase/firebase.js';
import { collection, getDocs, getDoc, updateDoc, doc } from "firebase/firestore";
import { useAuth } from '../firebase/auth';
//TODO 

const Quiz = ({ questions, handlePlayStateChange}) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answerIdx, setAnswerIdx]= useState(null);
    const [answer, setAnswer]= useState(null);
    const [result, setResult]= useState(resultInitialState);
    const [showResult, setShowResult]= useState(0);
    const [showStart, setShowStart]= useState(true);
    const [showAnswerTimer, setShowAnswerTimer]= useState(true);
    const { authUser, signOut } = useAuth();
    const myContainer = useRef(null);
    const [counter, setCounter] = useState(100);
    
    const questionLetter = ["A", "B", "C", "D"];

    const { questionString, choices, correctAnswer } = questions[currentQuestion];

    const onAnswerClick = (answer, index) => {
        setAnswerIdx(index);
        if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
            setAnswer(true)
        }
        else {
            setAnswer(false)
        }
    } 

    const resultClosure = () => {
        const getResult = () => {
          return result.score
        };
        return {
            getResult
        }
    }


    const mondayClosure = () => {
        const getMonday = () => {
            var d = new Date();
            var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
            return new Date(d.setDate(diff));
        };
        return {
            getMonday
        }
    }

    useEffect(() => {
        if (showResult) {
            const docRef = doc(db, 'users', authUser.email);
            const docSnap = getDoc(docRef).then((snapshot) => {
            const score = () => {
                const getScore = () => {
                    return resultClosure().getResult();
                };
                return {
                    getScore
                }
            }
              const mondayClosure1 = mondayClosure();
              const thisMonday = mondayClosure1.getMonday().toLocaleDateString().replaceAll('/', '');
              if (snapshot.data()[thisMonday] == -1) {
                updateDoc(docRef, {[thisMonday]: score().getScore()});
              }
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
                 score: result.score + Math.ceil(counter/100 *10),
                 correctAnswer: result.correctAnswer + 1
             }
             : {
                 ...result,
                 wrongAnswer: result.wrongAnswer + 1
             }
        );
        setCounter(100);
        if (currentQuestion !== questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1)
        }
        else {
            setCurrentQuestion(0);
            setShowResult(true);
            handlePlayStateChange(false);
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

    const handleScoreChange = () => {
        setCounter((counter) => counter - 1)
    }
    return (
        <div className="quiz-outer">
            <div className="quiz-container">
                { showStart ? (
                <div className="start-quiz-container">
                    <h1>Call yourself a Swiftie?</h1>
                    <button className='start-quiz' onClick={() => 
                        {
                            const docRef = doc(db, 'users', authUser.email);
                            const mondayClosure1 = mondayClosure();
                            const thisMonday = mondayClosure1.getMonday().toLocaleDateString().replaceAll('/', '');
                            const docSnap = getDoc(docRef).then((snapshot) => {
                                if (snapshot.data()["hasStarted" + thisMonday] && snapshot.data()[thisMonday] == -1) {
                                    updateDoc(docRef, {[thisMonday]: 0});
                                    setShowStart(false);
                                    handlePlayStateChange(true, true);
                                }
                                else if (!snapshot.data()["hasStarted" + thisMonday]){
                                    updateDoc(docRef, {["hasStarted" + thisMonday]: true});
                                    updateDoc(docRef, {[thisMonday]: -1});
                                    setShowStart(false);
                                    handlePlayStateChange(true, false);
                                }
                                else {
                                    setShowStart(false);
                                    handlePlayStateChange(true, true);
                                }
                            })
                        }}>Click to play!</button>
                </div>) :
                !showResult ? (<>
                    {showAnswerTimer && <AnswerTimer duration={100} onTimeUp={handleTimeUp} onScoreChange={handleScoreChange}/>}
                    <span className = "active-question-no">{ currentQuestion + 1 }</span>
                    <span className = "total-question">/{questions.length}</span>
                    <h2>{questionString}</h2>
                    <div className='answers-list'>
                        <ul>
                            {choices.map((answer, index) => (
                                <div className='heart-answer-container'>
                                    <div className='heart-container'>
                                        <span className='heart'>
                                            <div className='heart-letter'>{questionLetter[index]}</div>
                                        </span>
                                    </div>
                                    <li 
                                        key={answer}
                                        onClick={() => onAnswerClick(answer, index)}
                                        className={answerIdx === index ? 'selected-answer' : null}>
                                        {answer}
                                    </li>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className = "footer">
                        <button onClick={() => onClickNext(answer)} disabled={answerIdx === null}>
                            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </>) : 
                    <div className="result">
                        <h2>Come back next Monday for a shot at new questions!</h2>
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
                        <div className='next-actions'>
                            <button className = "next-action-button" onClick = {
                                async () => {
                                    await navigator.clipboard.writeText(`I scored a ${result.score} on the weekly quiz at whosyourmother.com. Can you beat me?`);
                                    alert("Copied to clipboard!");
                                }
                            }>Share Results</button>
                            <button className = "next-action-button" onClick = {onTryAgain}>Try Again?</button>
                        </div>
                    </div>             
                    }
                
            </div>
        </div>
    )
}

export default Quiz;