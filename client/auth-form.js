import React from 'react';

export const AuthForm = props => {
  const {name, handleAuthClick, handleSubmit, error} = props;

  //place errors on top.. (from state.user.error)
  //this form is used for login, signup (and maybe update.)

let formName = 'Log in';
let description = "Don't have an account yet?";
let option = 'Sign up';
if (name === 'signup'){
  formName = 'Sign up';
  description = 'Already have an account?';
  option = 'Log in';
}
  return (
    <div id="loginOrSignup">
      <form onSubmit={handleSubmit} name={name}>
      {name === 'signup' && (<div className='field'>
        <label htmlFor="uname">
          <strong>Name</strong>
        </label>
          <input name="uname" type="text" />
        </div>)}
        <div className='field'>
          <label htmlFor="email">
            <strong>Email</strong>
          </label>
          <input name="email" type="text" />
        </div>
        <div className='field'>
          <label htmlFor="password">
            <strong>Password</strong>
          </label>
          <input name="password" type="password" />
        </div>
        <div className='auth-btns'>
          <button className='submit' type="submit">{formName}</button><div className='auth-option'><label htmlFor="switch">
          {description}
        </label><a name='switch' type='button' className='nav-btn' onClick={handleAuthClick}>{option}</a></div>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
    </div>
  );
};
