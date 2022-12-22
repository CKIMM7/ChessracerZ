import React, { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../../../store/store';
import { auth } from "../../../../firebase";

import axios from 'axios'

function GoogleLogin() {
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

  return <div id="login">
            <>{user ? <div><p>user: {user.uid}</p>
              <img src={user.photo}></img>
              </div> : <p>user is not signed in</p>}
            <button onClick={signInHandler}>sign in with google</button>
            <button onClick={signOutHandler}>sign out</button>

             <p>{process.env.REACT_APP_URL}</p></>
        </div>

}

export default GoogleLogin;
