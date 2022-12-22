import React, { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from './store/store';
import { auth } from "./firebase";

import axios from 'axios'

function App() {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  const signInHandler = () => {
    dispatch(userActions.googleSignIn())
  }

  const signOutHandler = () => {
    dispatch(userActions.signOut())
  }

  const createAwsUser = () => {
    axios.post(`${process.env.REACT_APP_URL}/iam/new`, {
        name: user.name,
        guid: user.guid
      })
  }

  const ec2launchHandler = () => {
    axios.post(`${process.env.REACT_APP_URL}/ec2/create`, {
      name: user.name,
      guid: user.guid
    })
  }

  const ec2StopHandler = () => {
    axios.post(`${process.env.REACT_APP_URL}/ec2/stop`, {
      name: user.name,
      guid: user.guid
    })
  }

  const ec2StartHandler = () => {
    axios.post(`${process.env.REACT_APP_URL}/ec2/start`, {
      name: user.name,
      guid: user.guid
    })
  }


  const viewYourServers = () => {
    axios.post(`${process.env.REACT_APP_URL}/ec2/instances`, {
      name: user.name,
      guid: user.guid
    }).then((s) => {
      console.log(s)

    }).catch((e) => {
      console.log(e)
    })
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

  return (
    <div>
      {user ? <div><p>user: {user.uid}</p>
              <img src={user.photo}></img>
              </div> 
      : <p>user is not signed in</p>}
      <button onClick={signInHandler}>sign in with google</button>
      <button onClick={signOutHandler}>sign out</button>
      {user.id && <button onClick={createAwsUser}>create aws user</button>}
      
      {user.id && <button onClick={ec2launchHandler}>launch EC2 instance</button>}

      {user.id && <button onClick={ec2StopHandler}>stop EC2 instance</button>}

      {user.id && <button onClick={ec2StartHandler}>start EC2 instance</button>}

      {user.id && <button onClick={viewYourServers}>view your servers</button>}
      <p>{process.env.REACT_APP_URL}</p>
    </div>
  );
}

export default App;
