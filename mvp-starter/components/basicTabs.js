import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Quiz from './quiz';
import Quiz2 from './quiz2.js';
import { swiftieQuiz } from '../constants/constants.js';
import Leaderboard from './leaderboard.js';
import AboutUs from './aboutUs.js';
import { auth, db } from '../firebase/firebase.js';
import { collection, getDocs, getDoc, doc, limit, query, updateDoc, orderBy, onSnapshot } from "firebase/firestore";
import { Alert, Button, CircularProgress, Container, Dialog, DialogContent, DialogActions, Divider, IconButton, Snackbar, Stack, Typography } from '@mui/material';
import { useAuth } from '../firebase/auth';
import { useState, useEffect } from 'react';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [isPlaying, setIsPlaying]= useState(false);
  const [isQuiz2, setQuiz2] = React.useState(false);
  const { authUser, signOut } = useAuth();
  const [loadingQuestions, setLoadingQuestions] = useState(true); 
  const [questions, setQuestions] = useState([]); 

  const handleChange = (event, newValue) => {
    if (!(newValue !==0 && isPlaying)) {
      setValue(newValue);
    }
  };

  const handlePlayStateChange = (state) => {
    if (state) {
      alert("Only your first attempt will count towards the leaderboard. Good luck!");
    }
    setIsPlaying(state);
  }

  const userClosure = () => {
    const getUser = () => {
      return auth.currentUser.email;
    };
    return {
      getUser
    }
   }



  useEffect(() => { 
  const closure = userClosure();
  if (authUser) {
   if (closure.getUser() === "drewbeckwith12@gmail.com") {
     setQuiz2(true);
   }
   else {
    setQuiz2(false);
   }
    
    const loadPost = async () => { 
          // Till the data is fetch using API 
          // the Loading page will show. 
          setLoadingQuestions(true); 
          //const usersRef = collection(db, "questions");
          const docRef = doc(db, 'questions', "testid");
          const docSnap = await getDoc(docRef);
          var questions = [];

          // After fetching data stored it in posts state. 
          setQuestions(docSnap.data()["Question"]); 

          // Closed the loading page 
          setLoadingQuestions(false); 
    }; 
    // Call the function 
    loadPost(); 
}
}, [isQuiz2, authUser]); 

  return (
    (!authUser) ? <Box sx={{ width: '100%' }}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value}  aria-label="basic tabs example" textColor="secondary" indicatorColor="secondary" centered>
        <Tab label="Weekly Quiz" />
        <Tab label="Leaderboard" />
        <Tab label="About Us" />
      </Tabs>
    </Box></Box> :
    
    (loadingQuestions) ? <CircularProgress color = "inherit" sx={{ marginLeft: "50%", marginTop: "25%"}}>
    </CircularProgress> : (isQuiz2) ? <Quiz2 questions = {questions} ></Quiz2> :
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor="secondary" indicatorColor="secondary" centered>
          <Tab label="Weekly Quiz" {...a11yProps(0)} />
          <Tab label="Leaderboard" {...a11yProps(1)} />
          <Tab label="About Us" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        < Quiz questions = {questions} handlePlayStateChange = {handlePlayStateChange}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        < Leaderboard />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        < AboutUs />
      </CustomTabPanel>
    </Box>
  );
}
