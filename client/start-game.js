import React from "react";

export default function StartGame (props){

  const {startType, joinCode, handleJoinCode, handleStart, toggleStartType} = props;

  let startCode = Math.floor(Math.random()*9999);


return(
  <div>
   <div><a onClick={()=>toggleStartType('start')}>Start a Game</a> or <a onClick={()=>toggleStartType('join')}>Join a Game</a></div>

   {startType === 'start' &&
   (<div>
      <div>Here is your game code: {startCode}.</div>
      <br/>
      <div>Give the game code to your friend so they can join!</div>
      <a onClick={()=>handleStart(startCode)}>Play</a>
    </div>)}

    {startType === 'join' &&
   (<div>
      <div>Enter your game code:</div><input value={joinCode} onChange={(e)=>handleJoinCode(e)} type="text"/>
      <a onClick={()=>handleStart(+joinCode)}>Play</a>
    </div>)}
  </div>);
}
