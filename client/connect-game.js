import axios from 'axios';
import React, {useEffect, useState} from 'react';
import socket from './socket';

//board component
function Board (props) {
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

  const gamePlayer = props.player;
  const roomID = props.room;
  const userName = props.name;
  const game = props.game;
  const otherPlayer = props.opponent;
  const move = props.turn;
  const notice = props.message

  const [opponent, setOpponent] = useState(otherPlayer);
  const [turn, setTurn] = useState(move);
  const [message, setMessage] = useState(notice);
  const [gameData, setGameData] = useState(game);

  useEffect(() => {
    //update local state upon hearing from socket
    function handleGameChange(content) {
      setMessage(content.message);
      setTurn(content.turn);
      setGameData(content.gameData);
      setOpponent(content.userName);
    }

    socket.on("opponent_name", data => {
      setOpponent(data);
    });

    if(opponent === "..."){
      socket.emit("get_opponent_name");
    }

    socket.on("send_name", () => {
      socket.emit("sending_name", userName);
    });

    socket.on("player_pieced_out", (name) => {
      //stop game
      const preventMove = gamePlayer === 'r'? 'y' : 'r';
      setTurn(preventMove);
      setMessage(`${name} left the room!`);
      setOpponent('...');
    });

    if(!gameData.length){
      startNewGame()
    }

    //set game on session
    async function setGameSession(game) {
      //game is the object from socket move from other player
      const gameSession = {
        roomID: roomID,
        opponent: game.userName,
        player : gamePlayer,
        userName : userName,
        turn : game.turn,
        gameData : game.gameData,
      };

      try {
        await axios.post('/session', gameSession);
      } catch (err) {
        console.error(err);
      }
    }

    socket.on('move', content => {
      handleGameChange(content);
      setGameSession(content);
    })

    socket.on("connect_error", (err) => {
      //test setting a msg when socket is down and clearing it after join
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {
      socket.off('move');
      socket.off('send_name');
      socket.off('opponent_data');
      socket.off("connect_error");
    }
  }, []);
  //read more about this array

  async function sendGameState(game){
    socket.emit("drop_chip", {turn: game.turn, message: game.message, gameData: game.gameData, userName: game.userName});

    //update session
    game['roomID'] = roomID;
    game['opponent'] = opponent;
    game['player'] = gamePlayer;
    try {
      await axios.post('/session', game);
    } catch (err) {
      console.error(err);
    }
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

    //send out to other user and session if there is already a gameBoard and a new game is being started
    if(gameData.length){
      sendGameState(game);
    }

    setGameData(table);
    setMessage('');
  }

  //called when a move is made
  function dropChip(elem) {
    //not if out of turn or if someone already won or if there is no opponent
    if(gamePlayer === turn && message.indexOf('W') < 0 && opponent !=="..."){

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

      //Helper functions to check board for win. These check entire board on each move and should just check last move instead.
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
      }else{
        nextPlayer = turn === 'r' ? 'y' : 'r';
        message = '';
      }

      //update local state
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

  const chipColor = gamePlayer === 'r'? 'y': 'r';

  return (
    <div>
      <div className="game-info">
      {opponent === '...' && gamePlayer === 'r' && (<div id='start-message'><div>Waiting for someone to join with this code: {roomID}</div></div>)}
      </div>
      <div className="gol-body">
        <div id="gol-container">
          <div id='players'>
            <div className={gamePlayer}>{userName}</div>
            <div>VS.</div>
            <div className={chipColor}>{opponent}</div>
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
