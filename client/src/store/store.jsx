//import React, { useEffect } from "react"
import { createSlice, current } from '@reduxjs/toolkit';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { Chess } from 'chess.js'

const googleProvider = new GoogleAuthProvider();

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: '',
        iAmId: '',
        instanceId: '',
        lobbyId: '',
    },

    reducers: {

        setLobbyId(state, action) {
            state.lobbyId = action.payload
            console.log(state.lobbyId)
        },

        setUser(state, action) {
            console.log(action.payload)
            state.user = action.payload
        },
        
        signOut() {
            signOut(auth);
        },
        
        googleSignIn (state, action) {   
            console.log('googleSignin')
            signInWithPopup(auth, googleProvider)
            .then((result) => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const token = credential.accessToken;
              // The signed-in user info.
              const user = result.user;

              // ...
            }).catch((error) => {
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorMessage)
              // The email of the user's account used.
              const email = error.customData.email;
              // The AuthCredential type that was used.
              const credential = GoogleAuthProvider.credentialFromError(error);
              // ...
            });
        } 
    }})
    


    export const userActions = userSlice.actions;
    export default userSlice;
