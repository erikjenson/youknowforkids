import React, {useEffect, useState} from 'react';
// import Game from './connect';
import socket from './socket';

//board component
function Board (props) {
  console.log("props on BOARD component--> ", props);
  const boardData = props.boardData;
  let table = [];
  //draw a new board from game array
  for (let h = 0; h < boardData.length; h++) {
    let tr = [];
    for (let w = 0; w < boardData[0].length; w++) {
      let className = '';
      if(boardData[h][w]){
        className = boardData[h][w];
      }
      const td = <td key={h+w} data-r={h} data-c={w} className={className}/>;
      tr.push(td);
    }
    table.push(<tr key={h}>{tr}</tr>);
  }

  return (
    <table id="connect">
      <tbody className='gol' onClick={(e)=>{props.dropChip(e.target);}}>{table}</tbody>
    </table>
  );
};

// message component
const Notice = (props) => {
  //display whose turn it is or another message
  //when props updates
  console.log("props on notice component--> ", props);
  let message = "Red's Turn";
  if(props.message.length){
    message = props.message;
  }else if(!props.message.length && props.player === 'y'){
    message = "Yellow's Turn";
  }
  return(
    <div>
      <div id="message">{message}</div>
    </div>
  )
}

//start game component
const StartNew = (props) => {
  return(
    <div id="control_panel">
      <button id="restart_btn" type="button" onClick={props.startNewGame} className="button">Start New Game</button>
    </div>
  )
}

//connect 4 functional game component with state
function ConnectGame (props) {

  // const player = props.player;
  // const gameID = props.gameID;
  // const name = props.name;

  const gamePlayer = props.player;
  const roomID = props.gameID;
  const userName = props.name;

  // const [roomID, setRoomID] = useState(gameID);
  // const [userName, setUserName] = useState(name);
  // const [gamePlayer, setGamePlayer] = useState(player);
  const [opponent, setOpponent] = useState('');
  const [turn, setTurn] = useState('r');
  const [message, setMessage] = useState('');
  const [gameData, setGameData] = useState([]);

  useEffect(() => {
    //update local state upon hearing from socket
    function handleGameChange(content) {
      console.log("handleGameChange was called")
      setMessage(content.message);
      if(content.turn) setTurn(content.turn);
      if(content.gameData) setGameData(content.gameData);
      if(content.userName) setOpponent(content.userName);
    }

    //removed && gamePlayer === 'y'
    if(!gameData.length){
      startNewGame();
      console.log("called startNewGame!")
    }

    //removed && gamePlayer === 'y'
    //these two functions grab opponent info in a room if the other has joined already
    if(opponent === '' ){
      console.log("getting opponent name")
      getOpponent();
    }

    //removed && gamePlayer === 'r'
    if(opponent === '' ){
      setOpponent('...');
    }

    socket.on('move', content => {
      //showing empty msg string in content
      console.log("content received on move ", content)
      handleGameChange(content);
    })

    //when a user joins but no opponent data is available, this is requested and sent:
    socket.on("send_name", ()=>{
      socket.emit("sending_name", {userName, gameData});
    })

    //name and game data received from opponent
    socket.on("opponent_info", (data)=>{
      setOpponent(data.userName);
      //data is an empty array for some reason.
      // setGameData(data.gameData);
      console.log("got opponent data: ", data)
    })


    socket.on("connect_error", (err) => {
      //notify user that server is down
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {
      socket.off('move');
      socket.off('send_name');
      socket.off('opponent_name');
      socket.off("connect_error");
    }
  }, []);
  //read more about this array

  function sendGameState(game){
    console.log("sendGameState-->", game)
    socket.emit("drop_chip", {turn: game.turn, message: game.message, gameData: game.gameData, userName: game.userName});
  }

  function getOpponent(){
    socket.emit("get_opponent");
  }

  //starts a new game in same room / gameID
  function startNewGame(){
    const height = 6;
    const width = 7;

    let table = [];
    for(let i = 0; i<height; i++){
      let row = [];
      for(let j = 0; j<width; j++){
        row.push(0);
      }
      table.push(row);
    }

    const game = {
      turn: turn,
      message: '',
      gameData: table,
      userName: userName
    }
    setGameData(table);
    setMessage('');

    sendGameState(game);
  }

  //called when a move is made
  function dropChip(elem) {

    //not if out of turn or if someone already won
    if(gamePlayer === turn && message.indexOf('W') < 0){

      const column = elem.dataset.c;
      let data = gameData;
      let placedChip = false;

      //place the 'chip' if an empty spot is available
      for(let i=data.length-1; i>=0; i--){
        if(data[i][column] === 0){
          data[i][column] = turn;
          placedChip = true;
          break;
        }
      }

      if(!placedChip){
        setMessage("That's full!");
        return
      };

      //Helper functions to check board for win. These check entire board on each move and would be more efficient to just check last move.
      function getCell(row, col) {
        //this returns a value for the cell and 0 if invalid
        if (row < 0 || row > data.length - 1) {
          return 0;
        }
        if (col < 0 || col > data[0].length - 1) {
          return 0;
        }
        return data[row][col];
      }
      function checkHorizontal(val){
        for(let i = 0; i<data.length; i++){
          let count = 0;
          for(let j = 0; j<data[0].length; j++){
            if(data[i][j] === val && count > 0){
              count++;
            }else if(data[i][j] === val && count === 0){
              count = 1;
            }else if(data[i][j] !== val){
              count = 0;
            }
            if(count === 4){
              return "Win";
            }
          }
        }
      }
      // eslint-disable-next-line complexity
      function checkVertical(val){
        for(let j = 0; j<data[0].length; j++){
          let count = 0;
          for(let i = 0; i<data.length; i++){
            if(data[i][j] === val && count > 0){
              count++;
            }else if(data[i][j] === val && count === 0){
              count = 1;
            }else if(data[i][j] !== val){
              count = 0;
            }
            if(count === 4){
              return "Win";
            }
          }
        }
      }
      function checkDiagonal(val){
        for(let i=0; i<data.length; i++){
          for(let j=0; j<data[0].length; j++){
            if(data[i][j] === val){
              let left = searchDiagLeft(val, 1, i, j);
              let right = searchDiagRight(val, 1, i, j);
              if(left === "Win" || right === "Win"){
                return "Win";
              }
            }
          }
        }
      }
      function searchDiagLeft(val, count, i, j){
        if(count === 4){
          return 'Win';
        }
        if(getCell(i+1, j-1) === val){
          count++;
          return searchDiagLeft(val, count, i+1, j-1);
        }
      }
      function searchDiagRight(val, count, i, j){
        if(count === 4){
          return 'Win';
        }
        if(getCell(i+1, j+1) === val){
          count++;
          return searchDiagRight(val, count, i+1, j+1);
        }
      }
      function checkBoard(val){
        if(checkDiagonal(val) === 'Win'){
          return 'Win';
        }
        if(checkHorizontal(val) === 'Win'){
          return 'Win';
        }
        if(checkVertical(val) === 'Win'){
          return 'Win';
        }
      }

      const result = checkBoard(turn);
      let message = '';
      let nextPlayer = turn;

      if(result === "Win"){
        message = turn === 'y'? 'Yellow Wins!' : 'Red Wins!';
        //setMessage(message);
      }else{
        nextPlayer = turn === 'r' ? 'y' : 'r';
        message = '';
      }

      //update local state..should be done in useEffect?
      setMessage(message)
      setTurn(nextPlayer);
      setGameData(data);

      //send new gameData
      const game = {
        turn: nextPlayer,
        message: message,
        gameData: data,
        userName: userName
      }
      sendGameState(game);
    }
  }

  const otherPlayer = gamePlayer === 'r'? 'y': 'r';

  return (
    <div>
      <div className="game-info">
      {opponent === '...' && gamePlayer === 'r' && (<div><div>Send this to your friend!</div><div>Join Code: {roomID}</div></div>)}
      </div>
      <div className="gol-body">
        <div id="gol-container">
          <div id='players'>
            <div className={gamePlayer}>{userName}</div>
            <div>VS.</div>
            <div className={otherPlayer}>{opponent}</div>
          </div>
          {gameData.length > 0 && (<Notice player={turn} message={message} />)}
          <Board boardData={gameData} dropChip={dropChip}/>
          {gameData.length > 0 && (<StartNew startNewGame={startNewGame} />)}
        </div>
      </div>
    </div>
  );
}

export default ConnectGame;
