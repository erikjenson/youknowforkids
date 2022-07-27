import React from 'react';

export const AuthForm = props => {

  const {name, handleAuthClick, handleSubmit, error} = props;

  let formName = 'Log In';
  let description = "Don't have an account yet?";
  let option = 'Sign Up';

  if (name === 'signup'){
    formName = 'Sign Up';
    description = 'Already have an account?';
    option = 'Log In';
  }
  return (
    <div>
     <div className='auth-title'>{formName}</div>
     <div className='auth-error'>{error}</div>
      <div id="loginOrSignup">
        <form onSubmit={handleSubmit} name={name}>
          {name === 'signup' &&
          (<div className='field'>
            <input placeholder="Username" name="uname" type="text" />
          </div>)}

          <div className='field'>
            <input placeholder="Email" name="email" type="text" />
          </div>

          <div className='field'>
            <input placeholder="Password"  name="password" type="password" />
          </div>

          <div className='auth-btns'>
            <button className='submit' type="submit">{formName}</button>
            <div className='auth-option'>
              <label htmlFor="switch">{description}</label>
              <a name='switch' type='button' className='nav-btn' onClick={handleAuthClick}>{option}</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
