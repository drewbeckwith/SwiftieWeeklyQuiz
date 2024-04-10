import { useState, useEffect, useRef } from 'react';
import { resultInitialState } from '../constants/constants.js'; //resultInitialState from '../constants/constants.js'
import AnswerTimer from './AnswerTimer.jsx';
import { app, db } from '../firebase/firebase.js';
import { collection, getDocs, getDoc, updateDoc, doc, setDoc } from "firebase/firestore";
import { useAuth } from '../firebase/auth';
//TODO 
//3. admin roles
//4. test mode
//5. Fixed height
//6. leaderboard scrollable
//7. style sign in page

const Admin = ({questions}) => {
    console.log(questions);
    const questionLetter = ["A", "B", "C", "D"];
    const [questionState, setQuestionState] = useState(questions);

    const changeQuestions = () => {
        const questionsToChange = getQuestionsFromDocument();
        return questionsToChange;
    }

    const getQuestionsFromDocument = () => {
        const questionsFromDocument = []
        const questionEles = Array.from(document.getElementsByClassName("questionEditorDiv"));
        questionEles.forEach(element => {
            const textarea = element.getElementsByClassName("questionStringText")[0];
            const question = {"questionString": textarea.value, "choices": []};
            const choiceEles = Array.from(element.getElementsByClassName("choiceDiv"));
            choiceEles.forEach(choiceDiv => {
                const checkbox = choiceDiv.getElementsByClassName("checkboxCorrect")[0];
                const textarea = choiceDiv.getElementsByClassName("questionChoiceText")[0];
                question.choices.push(textarea.value);
                if (checkbox.checked) {
                    question.correctAnswer = textarea.value;
                }
            })
            questionsFromDocument.push(question);
        });
        return questionsFromDocument
    }

    const pushToFirebase = () => {
        const questions = {"Question": getQuestionsFromDocument()};
        const docRef = doc(db, 'questions', "testid");
        setDoc(docRef, questions);
    }

    const removeQuestion = (index) => {
        const questionStateCopy = changeQuestions();
        questionStateCopy.splice(index, 1);
        setQuestionState(questionStateCopy);

    }

    const addQestion = () => {
        setQuestionState(questionState.concat({"choices": ["", "", "", ""], "questionString": "", "correctAnswer": ""}));
    }    

    const inputChangedHandler = (event) => {
        event.preventDefault();
        // May be call for search result
    }

    return (
        <div>
            <div id='fullQuestionsList'>
                {questionState.map((question, index) => {
                    return (
                        <div className="questionEditorDiv" key={index}>
                            <label className="question">{(index + 1)}</label>
                            <textarea type="text" className="questionStringText" id="question" defaultValue = {question.questionString} required />
                            {question.choices.map((choice, index) => {
                                return (
                                    <div className="choiceDiv" key={index}>
                                        <label className="choice">{questionLetter[index]}</label>
                                        <textarea type="text" className="questionChoiceText" id="choice" defaultValue={choice} required />
                                        <input className = "checkboxCorrect" type="radio" name = {"checkboxCorrect " + question.questionString} defaultChecked = {question.correctAnswer === choice} />
                                    </div>
                                )
                            })
                            }
                            <button onClick={() => removeQuestion(index)}>Remove Question</button>
                        </div>
                )})}
                </div>
                <div className="form-example">
                    <button onClick={() => pushToFirebase()}>Change Questions</button>
                    <button onClick={() => addQestion()}>Add Question Template</button>
                </div>
        </div>
    )
}

export default Admin;