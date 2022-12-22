import React, { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from './store/store';
import { auth } from "./firebase";

import axios from 'axios'

import { Header } from "./components"

function App() {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  const signInHandler = () => {
    dispatch(userActions.googleSignIn())
  }

  const signOutHandler = () => {
    dispatch(userActions.signOut())
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      //console.log(user)

      if(user) {
      
      let user1 = {
        accessToken: user.accessToken,
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        photo: user.photoURL,
        guid: user.uid
      }
      //console.log(user1)
      axios.post(`${process.env.REACT_APP_URL}/user`, {
        data: user1
      })
      .then((user) => {
        console.log(user);
        dispatch(userActions.setUser(user.data))
    
      })
      .catch((e) => {
        console.log(e)
      })


    } else {
      console.log('no user')
      dispatch(userActions.setUser(''))
    }

    })

    return unsubscribe
  }, [])

  return <>
          <Header />
        </>
}

export default App;
