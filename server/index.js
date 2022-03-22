const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const {db, User} = require('./db');
const PORT = process.env.PORT || 8080;
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = new SequelizeStore({db});

// const main = require('../projects/main');
// const pixelate = require('../projects/pixelate');
// const gol = require('../projects/gol');
// const coffee = require('../projects/coffee-clicker');
// const connect4 = require('../projects/connect4');

//set up passport functions
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//session middleware with passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'not very secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./auth'));
//app.use('/api', require('./api'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/public/index.html'));
});

const syncDB = async () => {
await db.sync();
};

syncDB();

app.listen(PORT, () => {
  console.log(`Friendly service from port: ${PORT}`);
});

module.exports = app;
