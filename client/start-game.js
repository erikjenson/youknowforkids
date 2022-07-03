import React from "react";

export default function StartGame (props){

  const {startType, joinCode, handleJoinCode, handleStart, toggleStartType} = props;

  let startCode = Math.floor(Math.random()*9999);

  return(
    <div>
      {!startType &&
      (<div>
        <div className="margin-bottom-10" >Do you have a Join Code?</div>
        <div className="start-btns">
          <a className="grn-btn" onClick={()=>toggleStartType('join')}>YES</a>
          <a className="grn-btn" onClick={()=>toggleStartType('start')}>NO</a>
        </div>
      </div>)}

      {startType === 'start' &&
      (<div>
        <div>Here is your Join Code: <span className="join-code">{startCode}</span></div>
        <br/>
        <div className="margin-bottom-20">Send this Code to your friend!</div>
        <a className="grn-btn" onClick={()=>handleStart(startCode)}>START GAME</a>
      </div>)}

      {startType === 'join' &&
      (<div>
        <input className="join-input" placeHolder="Enter Join Code Here" value={joinCode} onChange={(e)=>handleJoinCode(e)} type="text"/>
        <a className="grn-btn" onClick={()=>handleStart(+joinCode)}>JOIN GAME</a>
      </div>)}

    </div>
  );
}
