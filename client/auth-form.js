import React from 'react';

export const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props;

  //this form is used for login signup and update.

  return (
    <div className="loginOrSignup">
      <form onSubmit={handleSubmit} name={name}>
        <div>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div>
        <div>
        <label htmlFor="name">
          <small>Name</small>
        </label>
          <input name="name" type="text" />
        </div>
        <div>
          <button type="submit">{displayName}</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
    </div>
  );
};
