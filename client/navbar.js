import React from 'react';

export default function Navbar (props){

  //eventually add a menu here for different apps

  const {authOption, handleAuthClick} = props;
  let displayName = 'Log in';
  if (authOption === 'login'){
    displayName = 'Sign up';
  }
  if (authOption === 'logout'){
    displayName = 'Log out';
  }

  return (
    <div id='nav-container'>
      <div>You know, for kids</div>
      <div><a type='button' className='nav-btn' onClick={handleAuthClick}>{displayName}</a></div>
    </div>
  );
}
