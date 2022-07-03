import React from 'react';
import axios from 'axios';
import {AuthForm} from './auth-form';
import Navbar from './navbar';
import StartGame from './start-game';
import ConnectGame from './connect-game';
import socket from './socket';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {user: {}, player: '', joinCode: '', startType: '', gameID: 0, authOption: 'login'};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.toggleStartType = this.toggleStartType.bind(this);
    this.handleJoinCode = this.handleJoinCode.bind(this);
  }

  //grabs user from session on mount
  async componentDidMount() {
    try {
      const res = await axios.get('/auth/me');
      if(res.data){
        this.setState({user: res.data});
        this.setState({authOption: 'logout'});
        console.log("user obj from api", res.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  //logout api call - toggles login/logout option
  async handleAuthClick(){
    if(!this.state.user.id){
    this.state.authOption === 'login'? this.setState({authOption: 'signup'}) :
    this.setState({authOption: 'login'});
    }else{
      try {
        await axios.post('/auth/logout');
        this.setState({user: {}});
        this.setState({authOption: 'login'});
      } catch (err) {
        console.error(err);
      }
    }
  }

  //sign-up / login api call
  async handleSubmit(evt){
    evt.preventDefault();
    const formName = evt.target.name;
    const name = evt.target.uname? evt.target.uname.value: null;
    const email = evt.target.email.value;
    const password = evt.target.password.value;

    const res = await axios.post(`auth/${formName}`, {email, password, name});
    if(res.data){
     this.setState({user: res.data});
     this.setState({authOption: 'logout'});
     evt.target.reset();
    }
  }

  //update this so it renders the first board for both players
  handleStart(code){
    this.setState({gameID: code});

    //connect to socket.. don't really care who they are so long as 2 and only 2 join a room/gameID
    socket.auth = { gameID: code, userID: this.state.user.name};
    socket.connect();
    //joins room/gameID on the server
  }

  toggleStartType(type){
    this.setState({startType: type});
    const player = type === 'start'? 'r': 'y';

    this.setState({player: player});
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

    {hasGameId && isLoggedIn && (<ConnectGame name={this.state.user.name} player={this.state.player} gameID={this.state.gameID} />)}

    </React.StrictMode>
    </div>
    );
  }
}

export default App;
