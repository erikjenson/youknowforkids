const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const main = require('../projects/main');
const pixelate = require('../projects/pixelate');
const gol = require('../projects/gol');

module.exports = app;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res, next) => {
  res.send(main());
});
app.get('/pixelate', (req, res, next) => {
  res.send(pixelate());
});
app.get('/gol', (req, res, next) => {
  res.send(gol());
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Friendly service from port: ${PORT}`);
});
