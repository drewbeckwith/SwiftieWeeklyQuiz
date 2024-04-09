/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Button, CircularProgress, Container, Dialog, Typography } from '@mui/material';
import { auth } from '../firebase/firebase.js';
import { db } from '../firebase/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { addDoc, collection, getDoc } from 'firebase/firestore';
import { useAuth, getAuth } from '../firebase/auth';
import styles from '../styles/landing.module.scss';
import NavBar from '../components/navbar';
import BasicTabs from '../components/basicTabs';


const REDIRECT_PAGE = '/dashboard';

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessURL: REDIRECT_PAGE, 
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID
  ]
}

export default function Home() {
  const { authUser, isLoading } = useAuth();
  const [login, setLogin] = useState(false);
  const router = useRouter();

  useEffect( () => {
    if (!isLoading && authUser) {
      router.push('/dashboard');
      addUserToCollection(authUser);
    }
  })

  async function addUserToCollection(authUser) {
    const docRef = doc(db, 'users', authUser.email);
    const docSnap = await getDoc(docRef);
    const user = auth.currentUser;
    if (!docSnap.exists()) {
      setDoc(docRef, { displayName: user.displayName, totalScore: 0 });
    }
  }

  return ((authUser || isLoading) ? <CircularProgress color = "inherit" sx={{ marginLeft: "50%", marginTop: "25%"}}>
  </CircularProgress> :
    <div>
      <Head>
        <title>WHO IS YOUR MOTHER?</title>
      </Head>
      <NavBar />
      <Container>
        <BasicTabs />
      </Container>
      <main className='mainLaunchScreen'>
      <div className="quiz-outer">
        <div className="quiz-container">
          <div className="start-quiz-container-no-auth">
              <h1>Call yourself a Swiftie?</h1>
              <Button className='buttonLogin' variant="contained" color="secondary"
                onClick={() => setLogin(true)}>
                Login / Register to Play!
              </Button>
              <Dialog open= {login} onClose={() => 
              {
              setLogin(false)
              }}>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}></StyledFirebaseAuth>
            </Dialog>
          </div>
        </div> 
      </div>
      </main>
    </div>);
}