import { useState, useEffect, useRef } from 'react';
import { resultInitialState } from '../constants/constants.js'; //resultInitialState from '../constants/constants.js'
import AnswerTimer from './AnswerTimer.jsx';
import { app, db } from '../firebase/firebase.js';
import { collection, getDocs, getDoc, updateDoc, doc, setDoc } from "firebase/firestore";
import { useAuth } from '../firebase/auth';
//TODO 

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
        const questionStateCopy = changeQuestions();
        setQuestionState(questionStateCopy.concat({"choices": ["", "", "", ""], "questionString": "", "correctAnswer": ""}));
    }    

    function TextBox ({id, className, defaultText}) {

        const [text, setText] = useState(defaultText);
    
       return (
               <textarea id = {id} 
                 className = {className}
                 value={text} 
                 onChange={(e) => setText(e.target.value) }>
              </textarea>
             );
    
    }

    function RadioButton ({id, className, name, defaultChecked}) {

        const onOff = {
            on: true,
            off: false}

        const [checked, setChecked] = useState(defaultChecked);
    
       return (
               <input id = {id}
                 type="radio"
                 name = {name}
                 className = {className}
                 defaultChecked={checked} 
                 onChange={(e) => setChecked(onOff[e.target.value]) }>
              </input>
             );
    
    }
    

    return (
        <div>
            <div id='fullQuestionsList'>
                {questionState.map((question, index) => {
                    return (
                        <div className="questionEditorDiv" key={index}>
                            <label className="question">{(index + 1)}</label>
                            <TextBox id = {"question"} className={"questionStringText"} defaultText={question.questionString} />
                            {question.choices.map((choice, indexChoice) => {
                                return (
                                    <div className="choiceDiv" key={indexChoice}>
                                        <label className="choice">{questionLetter[indexChoice]}</label>
                                        <TextBox id = {"choice"} className={"questionChoiceText"} defaultText={choice} />
                                        <RadioButton className = {"checkboxCorrect"}  name = {"checkboxCorrect " + question.questionString + index} defaultChecked = {question.correctAnswer === choice} />
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