import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './app';
import ConnectGame from './connect-game';

// const root = ReactDOM.createRoot(
//   document.getElementById("app")
// );

// root.render(
// <BrowserRouter>
//   <App />
// </BrowserRouter>);

ReactDOM.render(
  <App />
  , document.getElementById('app'));
