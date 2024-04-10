import { useState, useEffect, useRef } from 'react';
import { resultInitialState } from '../constants/constants.js'; //resultInitialState from '../constants/constants.js'
import AnswerTimer from './AnswerTimer.jsx';
import { app, db } from '../firebase/firebase.js';
import { collection, getDocs, getDoc, updateDoc, doc } from "firebase/firestore";
import { useAuth } from '../firebase/auth';
//TODO 
//3. admin roles
//4. test mode
//5. Fixed height
//6. leaderboard scrollable
//7. style sign in page

const Admin = ({questions}) => {
    return (
        <div>
        </div>
    )
}

export default Admin;