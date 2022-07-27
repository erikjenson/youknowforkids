import React from "react";

export default function StartGame (props){

  const {joinCode, handleJoinCode, handleStart, togglePlayer, player, name} = props;

  return(
    <div>
      {!player &&
      (<div>
        <div className="margin-bottom-10" >Do you have a Join Code?</div>
        <div className="start-btns">
          <a className="grn-btn" onClick={()=>togglePlayer('y')}>YES</a>
          <a className="grn-btn" onClick={()=>togglePlayer('r')}>NO</a>
        </div>
      </div>)}

      {player === 'y' &&
      (<div id="join-form">
        <input className="join-input" placeholder="Enter Join Code Here" value={joinCode} onChange={(e)=>handleJoinCode(e)} type="text"/>
        <a className="grn-btn" onClick={()=>handleStart(+joinCode, player, name)}>JOIN GAME</a>
      </div>)}
    </div>
  );
}
