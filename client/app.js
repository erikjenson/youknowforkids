import React from 'react';
import axios from 'axios';
// import ConnectGame from './connect-game';
import {AuthForm} from './auth-form';
import Navbar from './navbar';
import StartGame from './start-game';
import ConnectGame from './connect-game';

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import {fbConfig, vapidKey} from '../secrets';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
//const firebaseConfig = fbConfig()();

// Initialize Firebase
//const app = initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service
//const messaging = getMessaging(app);
//messaging.getToken({vapidKey: vapidKey()()});


// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.

// getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });

//tryc and send token to server to store in db. should we see if they have a token already?
//is each token for each client or app?






class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {user: {}, joinCode: '', startType: '', gameID: 0, authOption: 'login'};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.toggleStartType = this.toggleStartType.bind(this);
    this.handleJoinCode = this.handleJoinCode.bind(this);
  }

  async componentDidMount() {
    try {
      const res = await axios.get('/auth/me');
      if(res.data){
        this.setState({user: res.data});
        this.setState({authOption: 'logout'});
      }
      console.log("data", res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async handleAuthClick(){
    if(!this.state.user.id){
    this.state.authOption === 'login'? this.setState({authOption: 'signup'}) :
    this.setState({authOption: 'login'});
    }else{
      try {
        await axios.post('/auth/logout');
        this.setState({user: {}});
        this.setState({authOption: 'login'});
        console.log("logged out");
      } catch (err) {
        console.error(err);
      }
    }
  }

  async handleSubmit(evt){
    evt.preventDefault();
    const formName = evt.target.name;
    const name = evt.target.uname? evt.target.uname.value: null;
    const email = evt.target.email.value;
    const password = evt.target.password.value;
    const res = await axios.post(`auth/${formName}`, {email, password, name});
    if(res.data){
      console.log("logged in");
     this.setState({user: res.data});
     this.setState({authOption: 'logout'});
     evt.target.reset();
    }
  }

  handleStart(code){
    this.setState({gameID: code});
  }
  toggleStartType(type){
    this.setState({startType: type});
  }
  handleJoinCode(evt){
    const join = evt.target.value;
    this.setState({joinCode: join});
  }

  render(){
    const isLoggedIn = this.state.user? this.state.user.email: null;
    const hasGameId = this.state.gameID? this.state.gameID: null;

    return (
    <div id='main'>
    <React.StrictMode>

    <Navbar handleAuthClick={this.handleAuthClick} authOption={this.state.authOption}/>

     {!isLoggedIn && (<AuthForm name={this.state.authOption} handleAuthClick={this.handleAuthClick} handleSubmit={this.handleSubmit} />)}

     {!hasGameId && isLoggedIn && (<StartGame joinCode={this.state.joinCode} handleJoinCode={this.handleJoinCode} startType={this.state.startType} handleStart={this.handleStart} toggleStartType={this.toggleStartType}/>)}

    {hasGameId && isLoggedIn && (<ConnectGame />)}

    </React.StrictMode>
    </div>
    );
  }
}

export default App;
