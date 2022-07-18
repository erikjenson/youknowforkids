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

// eslint-disable-next-line max-statements, complexity
io.on('connection', (socket) => {

  console.log("socket room name on server connection", socket.handshake.auth.gameID);
  console.log("socket user name on server connection", socket.handshake.auth.userID);
  console.log("socket user type on server connection", socket.handshake.auth.type);
  console.log("socket id on server connection", socket.id);

  // for future messaging
  // const id = socket.handshake.auth.gameID;
  // const user = socket.handshake.auth.userID;
  // const users = [];
  // for (let [socket] of io.of("/").sockets) {
  //   // if (socket.gameID === id && socket.userID !== user){
  //     users.push({
  //       userID: socket.userID,
  //       gameID: socket.gameID,
  //     });
  //     // }
  //   }

  const room = socket.handshake.auth.gameID;
  const type = socket.handshake.auth.type;
  const rooms = io.of("/").adapter.rooms;
  let roomSize = 0;

  //these statements run on connect() and are called once

  //a room exists if count > 0;
  for (const [r] of rooms){
    console.log("r---> ", rooms.get(r).size);
    if(r === room){

      roomSize = rooms.get(r).size;;
      break;
    }
  }
  //fix -  if count == 0, reset code
  //this needs to be checked back when the join code is defined

  // see how many users are in the room set
  // if(count === 1){
  //   roomSize = room.size;
  //   console.log("room size--> ", roomSize);
  // }

  if(type === 'start'){
    socket.join(room);
    io.in(socket.id).emit("joined", {room: room, joined: true});
  }

  if(type === 'join'){
    //this should also check if < 2 users are in teh room.. make sure room is occupied when one user gets a join code.
    //how do we handle the situation when a starter hasn't started? We should auto start them as soon as they hit "NO."

    console.log("ROOMSIZE -> ", roomSize);
    if(roomSize === 1){
      socket.join(room);
      io.in(socket.id).emit("joined", {room: room, joined: true});
    }else{
      io.in(socket.id).emit("joined", {room: room, joined: false});
      socket.disconnect();
    }
  }

  console.log("rooms: ", rooms);

  // for future messaging
  // notify existing users when a new one joins
  // socket.broadcast.emit("user_connected", {
  //   userID: socket.userID,
  //   gameID: socket.gameID,
  // });

  //on drop chip send move obj to room
  socket.on('drop_chip', (content)=>{
    console.log("drop_chip called on server sending this, ", content);
    socket.to(socket.gameID).emit("move", content);
  });

  socket.on("get_opponent", ()=>{
   socket.to(socket.gameID).emit("send_name");
  });

  socket.on("sending_name", data => {
    socket.to(socket.gameID).emit("opponent_info", data);
  });

  socket.on("disconnect", (reason) => {
    console.log("socket server DISconnection", reason);
  });
});

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
