import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {AuthForm} from './auth-form';
import Navbar from './navbar';
import StartGame from './start-game';
import ConnectGame from './connect-game';
import socket from './socket';

function App() {

    // this.state = {user: {}, error: '', player: '', joinCode: '', startType: '', gameID: 0, authOption: 'login'};
    const [user, setUser] = useState({});
    const [error, setError] = useState('');
    const [player, setPlayer] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [startType, setStartType] = useState('');
    const [gameID, setGameID] = useState(0);
    const [authOption, setAuthOption] = useState('login');

    useEffect(() => {

      //grabs user from session on mount
      async function getUser() {
        try {
          const res = await axios.get('/auth/me');
          if(res.data){
            setUser(res.data);
            setAuthOption('logout');
            console.log("user obj from api", res.data);
          }
        } catch (err) {
          console.error(err);
        }
      }

      if(!user.email){
        getUser();
      }

      socket.on("joined", (val)=>{
        if(val.joined){
          console.log("here's the join code: ", val.room);
          //code is a good one so send it in!

          setGameID(val.room);
          setError('You Joined The Room!');
        }
        else{
          setError(`Oh No! ${val.room} Didn't Work!`);
        }
      });

      return () => {
        socket.off('joined');
      };

    },[]);


  //logout api call - toggles login/logout option
  async function handleAuthClick(){
    if(!user.id){
    authOption === 'login'? setAuthOption('signup') : setAuthOption('login');
    }else{
      try {
        await axios.post('/auth/logout');
        setUser({});
        setAuthOption('login');
      } catch (err) {
        console.error(err);
      }
    }
  }

  //sign-up / login api call
  async function handleSubmit(evt){
    evt.preventDefault();
    const formName = evt.target.name;
    const name = evt.target.uname? evt.target.uname.value: null;
    const email = evt.target.email.value;
    const password = evt.target.password.value;

    const res = await axios.post(`auth/${formName}`, {email, password, name});
    if(res.data){
     setUser(res.data);
     setAuthOption('logout');
     evt.target.reset();
    }
  }

  //join room, first check if joining and if room exists
  function handleStart(code, type = null){
    console.log("called handleStart--> ", code);
    console.log("called handleStart / startType--> ", type);
    setJoinCode(code);
    //when type = 'start' it will be passed in, otherwise it is on state
    if(!type) type = startType;
    socket.auth = { gameID: code, userID: user.name, type: type};
    socket.connect();
  }

  function toggleStartType(type){
    setStartType(type);
    const color = type === 'start'? 'r': 'y';
    setPlayer(color);
    if(type === 'start'){
      //immediately create and join the room
      let code = Math.floor(Math.random()*9999);
      handleStart(code, type);
      //connect and return code in a socket listener
    }
  }

  function handleJoinCode(evt){
    const jCode = evt.target.value;
    setJoinCode(jCode);
  }

  // const isLoggedIn = user? user.email: null;
  // const hasGameId = gameID? gameID: null;

  return (
  <div id='main'>
    <React.StrictMode>

      <Navbar handleAuthClick={handleAuthClick} authOption={authOption}/>

      {!user.email && (<AuthForm name={authOption} handleAuthClick={handleAuthClick} handleSubmit={handleSubmit} />)}

      {!gameID && user.email && (<div><div id="join-error">{error}</div><StartGame joinCode={joinCode} handleJoinCode={handleJoinCode} startType={startType} handleStart={handleStart} toggleStartType={toggleStartType}/></div>)}

      {gameID > 0 && user.email && (<ConnectGame name={user.name} player={player} gameID={gameID} />)}

    </React.StrictMode>
  </div>
  );

}

export default App;
