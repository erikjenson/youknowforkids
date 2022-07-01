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
//const {Game} = require("/connect");

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

const server = app.listen(PORT, () => {
  console.log(`Friendly service from port: ${PORT}`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {

  //on connection, there is a socket id for every client server connection. these ids can be used to send messages to specific users. because connections are dropped and remade, we need to replace the user's socket id that we use for connections. in this example we use a gameID for our room. on a game move we send the new game object to the room and update all state for listeners to the room. to make sure the object is sent to the correct room... join? update socket ids?

  socket.join(socket.handshake.auth.gameID);

  console.log("socket room name on server connection", socket.handshake.auth.gameID);
  console.log("socket id on server connection", socket.id);
  console.log("socket room on server connection", socket.room);
  // const users = [];
  // for (let [socket] of io.of("/").sockets) {
  //   users.push({
  //     userID: socket.userID,
  //     gameID: socket.gameID,
  //   });
  // }
  //send out all users to all users
  // socket.emit("users", users);

 //add user to gameID room



  // notify existing users when a new one joins
  // socket.broadcast.emit("user connected", {
  //   userID: socket.userID,
  //   gameID: socket.gameID,
  // });

  //on drop chip send move obj to room
  socket.on('drop_chip', (content)=>{

    socket.to(socket.gameID).emit("move", content);
    //send to api to update game data
  });

  socket.on("disconnect", (reason) => {
    console.log("socket server DISconnection", reason);
  });


});
//
io.use((socket, next) => {
  const gameID = socket.handshake.auth.gameID;
  const userID = socket.handshake.auth.userID;
  if (!gameID || !userID) {
    return next(new Error("missing game code"));
  }
  socket.gameID = gameID;
  socket.userID = userID;
  next();
});

module.exports = app;
