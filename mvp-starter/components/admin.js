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
    const changeQuestions = () => {
        const docRef = doc(db, 'questions', "testid");
        const questionEles = Array.from(document.getElementsByClassName("questionStringText"));
        const questions = {"Question": []};
        questionEles.forEach(element => {
            const question = {"questionString": element.value, "choices": []};
            const choiceEles = Array.from(document.getElementsByClassName("choiceDiv"));
            choiceEles.forEach(choiceDiv => {
                const checkbox = choiceDiv.getElementsByClassName("checkboxCorrect")[0];
                const textarea = choiceDiv.getElementsByClassName("questionChoiceText")[0];
                question.choices.push(textarea.value);
                if (checkbox.checked) {
                    question.correctAnswer = textarea.value;
                }
            })
            questions.Question.push(question);
        });
        setDoc(docRef, questions);
    }
    const questionLetter = ["A", "B", "C", "D"];

    return (
        <div>
                {questions.map((question, index) => {
                    return (
                        <div className="questionEditorDiv" key={index}>
                            <label className="question">{(index + 1) + "." + question.questionString}</label>
                            <textarea type="text" className="questionStringText" id="question" defaultValue = {question.questionString} required />
                            {question.choices.map((choice, index) => {
                                return (
                                    <div className="choiceDiv" key={index}>
                                        <label className="choice">{questionLetter[index]}</label>
                                        <textarea type="text" className="questionChoiceText" id="choice" defaultValue={choice} required />
                                        <input className = "checkboxCorrect" type="radio" name = "checkboxCorrect" defaultChecked = {question.correctAnswer === choice} />
                                    </div>
                                )
                            })
                            }   
                        </div>
                )})}
                <div className="form-example">
                    <button onClick={() => changeQuestions()}>Change Questions</button>
                </div>
        </div>
    )
}

export default Admin;