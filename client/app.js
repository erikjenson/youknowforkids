import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {AuthForm} from './auth-form';
import Navbar from './navbar';
import StartGame from './start-game';
import ConnectGame from './connect-game';
import socket from './socket';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  //rename state to be more specific
  const [user, setUser] = useState({});
  const [authOption, setAuthOption] = useState('login');
  const [error, setError] = useState('');

  const [notice, setNotice] = useState('');
  const [roomID, setRoomID] = useState(0);
  const [joinCode, setJoinCode] = useState('');
  const [player, setPlayer] = useState('');

  const [game, setGame] = useState([]);
  const [player2, setPlayer2] = useState('...');
  const [turn, setTurn] = useState('r');
  const [message, setMessage] = useState('');


  useEffect(() => {

    //grabs user from session on mount
    async function getUser() {
      try {
        const res = await axios.get('/auth/me');
        if(res.data){
          setUser(res.data);
          setAuthOption('logout');
        }
      } catch (err) {
        console.error(err);
      }
    }

    if(!user.email){
      getUser();
    }

    // grab game session on mount
    async function getGameFromSession() {
      try {
        const {data} = await axios.get('/session');
        if(data){
          setGame(data.gameData);
          setPlayer(data.player);
          setRoomID(data.roomID);
          setPlayer2(data.opponent);
          setMessage(data.message);
          setTurn(data.turn);

          if(data.roomID){
            //re-join socket with old roomID
            const reJoin = true;
            handleSocketStart(data.roomID, data.player, data.userName, reJoin);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    if(!game.gameID){
      getGameFromSession();
    }

    socket.on("joined", (val)=>{
      if(val.joined){
        setRoomID(+val.room);
        setNotice('You Joined The Room!');
      }
      else{
        setNotice(`Oh No! ${val.room} Didn't Work!`);
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
    setError('');
    }else{
      //tell other player their opponent logged out
      socket.emit("player_piecing_out", user.name);
      socket.disconnect();
      try {
        await axios.delete('/session');
        setGame({});
        setPlayer('');
        setTurn('r');
        setPlayer2('...');
        setRoomID(0);
        setNotice('');

      } catch (err) {
        console.error(err);
      }
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
    try {
      const res = await axios.post(`auth/${formName}`, {email, password, name});
      if(res.status === 200){
        setUser(res.data);
        setAuthOption('logout');
        setError('');
        evt.target.reset();
      }
    } catch (err) {
      setError('Incorrect username and/or password');
    }
  }

  //join room on socket, first check if joining and if room exists
  function handleSocketStart(code, type, name){
    socket.auth = { roomID: code, userName: name, player: type};
    socket.connect();
  }

  function togglePlayer(color){
    setPlayer(color);
    if(color === 'r'){
      //immediately create and join the room
      let code = Math.floor(Math.random()*9999);
      handleSocketStart(code, color, user.name);
    }
  }

  function handleJoinCode(evt){
    const jCode = evt.target.value;
    setJoinCode(jCode);
  }

  return (
  <div id='main'>
    <React.StrictMode>

      <Navbar handleAuthClick={handleAuthClick} authOption={authOption}/>

      {!user.email && (<AuthForm name={authOption} handleAuthClick={handleAuthClick} handleSubmit={handleSubmit} error={error} />)}

      {!roomID && user.email && (<div><div id="join-message">{notice}</div><StartGame joinCode={joinCode} player={player} name={user.name} handleJoinCode={handleJoinCode} handleStart={handleSocketStart} togglePlayer={togglePlayer}/></div>)}

      {roomID > 0 && user.email && (<ConnectGame name={user.name} player={player} room={roomID} opponent={player2} turn={turn} message={message} game={game} />)}

    </React.StrictMode>
  </div>
  );

}

export default App;
