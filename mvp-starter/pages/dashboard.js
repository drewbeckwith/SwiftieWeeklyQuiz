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

 import { useState, useEffect } from 'react';
 import Head from 'next/head';
 import { useRouter } from 'next/router';
 import { Alert, Button, CircularProgress, Container, Dialog, DialogContent, DialogActions, Divider, IconButton, Snackbar, Stack, Typography } from '@mui/material';
 import AddIcon from '@mui/icons-material/Add';
 import NavBar from '../components/navbar';
 import ReceiptRow from '../components/receiptRow';
 import ExpenseDialog from '../components/expenseDialog';
 import BasicTabs from '../components/basicTabs';
 import { useAuth } from '../firebase/auth';
 import { deleteReceipt, getReceipts } from '../firebase/firestore';
 import { deleteImage } from '../firebase/storage';
 import styles from '../styles/dashboard.module.scss';

const ADD_SUCCESS = "Receipt was successfully added!";
const ADD_ERROR = "Receipt was not successfully added!";
const EDIT_SUCCESS = "Receipt was successfully updated!";
const EDIT_ERROR = "Receipt was not successfully updated!";
const DELETE_SUCCESS = "Receipt successfully deleted!";
const DELETE_ERROR = "Receipt not successfully deleted!";

// Enum to represent different states of receipts
export const RECEIPTS_ENUM = Object.freeze({
  none: 0,
  add: 1,
  edit: 2,
  delete: 3,
});

const SUCCESS_MAP = {
  [RECEIPTS_ENUM.add]: ADD_SUCCESS,
  [RECEIPTS_ENUM.edit]: EDIT_SUCCESS,
  [RECEIPTS_ENUM.delete]: DELETE_SUCCESS
}

const ERROR_MAP = {
  [RECEIPTS_ENUM.add]: ADD_ERROR,
  [RECEIPTS_ENUM.edit]: EDIT_ERROR,
  [RECEIPTS_ENUM.delete]: DELETE_ERROR
}

export default function Dashboard() {
  const { authUser, isLoading } = useAuth();
  const router = useRouter();
  const [action, setAction] = useState(RECEIPTS_ENUM.none);

  // State involved in loading, setting, deleting, and updating receipts
  const [isLoadingReceipts, setIsLoadingReceipts] = useState(true);
  const [deleteReceiptId, setDeleteReceiptId] = useState("");
  const [deleteReceiptImageBucket, setDeleteReceiptImageBucket] = useState("");
  const [updateReceipt, setUpdateReceipt] = useState({});

  // State involved in snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSuccessSnackbar, setSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setErrorSnackbar] = useState(false);

  // Listen to changes for loading and authUser, redirect if needed
  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  }, [authUser, isLoading]);
  // For all of the onClick functions, update the action and fields for updating
  return ((!authUser || isLoading) ? <CircularProgress color = "inherit" sx={{ marginLeft: "50%", marginTop: "25%"}}>
    </CircularProgress> :
    <div>
      <Head>
        <title>WHO IS YOUR MOTHER?</title>
      </Head>

      <NavBar />
      <Container>
        <Snackbar open={showSuccessSnackbar} autoHideDuration={1500} onClose={() => setSuccessSnackbar(false)}
                  anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
          <Alert onClose={() => setSuccessSnackbar(false)} severity="success">{snackbarMessage}</Alert>
        </Snackbar>
        <Snackbar open={showErrorSnackbar} autoHideDuration={1500} onClose={() => setErrorSnackbar(false)}
                  anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
          <Alert onClose={() => setErrorSnackbar(false)} severity="error">{snackbarMessage}</Alert>
        </Snackbar>
        <BasicTabs />
        <div className='footer'>
        <p style={{ textAlign: 'center' }}></p>
        </div>
      </Container> 
    </div>
  )
}