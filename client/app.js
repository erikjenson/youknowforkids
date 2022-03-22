import React from 'react';
import axios from 'axios';
// import ConnectGame from './connect-game';
import {AuthForm} from './auth-form';
import Navbar from './navbar';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {user: {}, gameID: '', authOption: 'login'};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);
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

  render(){
    const isLoggedIn = this.state.user? this.state.user.email: null;
    return (
    <div id='main'>
      <Navbar handleAuthClick={this.handleAuthClick} authOption={this.state.authOption}/>

     {!isLoggedIn && (<AuthForm name={this.state.authOption} handleAuthClick={this.handleAuthClick} handleSubmit={this.handleSubmit} />)}
     </div>
    );
  }
}

export default App;
