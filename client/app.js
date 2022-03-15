import React from 'react';
import Board from "./board";
import Game from './connect';


const Notice = (props) => {
  let message = "Red's Turn";
  if(props.message.length){
    message = props.message;
  }else if(!props.message.length && props.player === 'y'){
    message = "Yellow's Turn";
  }
  return(
    <div>
      <h1>{message}</h1>
    </div>
  )
}

const StartNew = (props) => {
  return(
    <div id="control_panel">
      <button id="restart_btn" type="button" onClick={props.startNewGame} className="button">Start New Game</button>
    </div>
  )
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {player: 'r', message: '', board: [], game: {}};
    this.dropChip = this.dropChip.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
  }

  componentDidMount() {
    this.startNewGame();
  }

  startNewGame(){
    const height = 6;
    const width = 7;
    this.setState({player: 'r', message: '', game: new Game(width,height)});
    const table = [];
    for (let h = 0; h < height; h++) {
      let tr = [];
      for (let w = 0; w < width; w++) {
        const td = <td key={h+w} data-r={h} data-c={w}/>;
        tr.push(td);
      }
      table.push(<tr key={h}>{tr}</tr>);
    }
    this.setState({board: table});
  }

  renderBoard(x,y){
    let table = [];
    for (let h = 0; h < this.state.game.height; h++) {
      let tr = [];
      for (let w = 0; w < this.state.game.width; w++) {
        let className = '';
        if(this.state.game.board[h][w]){
          className = this.state.game.board[h][w];
        }else if( x == h && y == w){
          className = this.state.game.player;
        }
        const td = <td key={h+w} data-r={h} data-c={w} className={className}/>;

        tr.push(td);
      }
      table.push(<tr key={h}>{tr}</tr>);
    }
    this.setState({board: table});
  }

  dropChip(elem) {
    const coords = this.state.game.setCell(elem.dataset.c);
    if(this.state.message.indexOf('W') > -1){
      return
    };
    if(!coords){
      this.setState({message: "That's full!"})
      return
    };

    const x = coords[0];
    const y = coords[1];
    this.renderBoard(x,y);
    if(this.state.game.checkBoard(this.state.game.player) === "Win"){
      const message = this.state.game.player === 'y'? 'Yellow Wins!' : 'Red Wins!';
      this.setState({message: message});
    }else{
      this.state.game.changePlayer();
      const nextPlayer = this.state.game.player;
      this.setState({message: ''})
      this.setState({player: nextPlayer});
    }
  }

  render(){
      return (
      <div className="gol-body">
        <div id="gol-container">
          <h1>Connect 4</h1>
          <Notice player={this.state.player} message={this.state.message} />
          <Board board={this.state.board} dropChip={this.dropChip}/>
          <StartNew startNewGame={this.startNewGame} />
        </div>
      </div>
    );
  }
}

export default App;
