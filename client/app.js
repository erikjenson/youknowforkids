import React from 'react';
import axios from 'axios';
import ConnectGame from './connect-game';
import AuthForm from './auth-form';
export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {user: {}, gameID: ''};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
  }

  async componentDidMount() {
    try {
      const res = await axios.get('/auth/me')
      if(res.data) this.setState({user: res.data});
    } catch (err) {
      console.error(err);
    }
  }

  handleSubmit(){

  }

  render(){
    return (
      <div>
        {/* not built yet <Navbar /> */}
        {/* if not logged in <AuthForm {name, displayName, handleSubmit, error}/> */}
        {/* if logged in and game is set up <ConnectGame /> */}
      </div>
    );
  }
}
