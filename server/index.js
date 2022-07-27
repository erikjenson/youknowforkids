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
app.use('/session', require('./session'));
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

  // console.log("socket room name on server connection", socket.handshake.auth.roomID);
  // console.log("socket user name on server connection", socket.handshake.auth.userName);
  // console.log("socket user type on server connection", socket.handshake.auth.player);
  // console.log("socket id on server connection", socket.id);

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

  const room = socket.handshake.auth.roomID;
  const player = socket.handshake.auth.player;
  const reJoin = socket.handshake.auth.reJoin;
  const rooms = io.of("/").adapter.rooms;
  let roomSize = 0;

  //these statements run on connect() and are called once

  //a room exists if count > 0;
  for (const [r] of rooms){
    //console.log("r---> ", rooms.get(r).size);
    if(r === room){
      roomSize = rooms.get(r).size;;
      break;
    }
  }

  if(player === 'r' || reJoin){
    socket.join(room);
    io.in(socket.id).emit("joined", {room: room, joined: true});
    socket.to(socket.roomID).emit("opponent_name", socket.userName);
  }

  if(player === 'y'){
    //console.log("ROOMSIZE -> ", roomSize);
    if(roomSize > 0 && roomSize < 2){
      socket.join(room);
      io.in(socket.id).emit("joined", {room: room, joined: true});
      socket.to(socket.roomID).emit("opponent_name", socket.userName);
    }else{
      io.in(socket.id).emit("joined", {room: room, joined: false});
      socket.disconnect();
    }
  }

  // console.log("rooms: ", rooms);

  // for future messaging
  // notify existing users when a new one joins
  // socket.broadcast.emit("user_connected", {
  //   userID: socket.userID,
  //   gameID: socket.gameID,
  // });

  //on drop chip send move obj to room
  socket.on('drop_chip', (content)=>{
    socket.to(socket.roomID).emit("move", content);
  });

  socket.on("get_opponent_name", ()=>{
   socket.to(socket.roomID).emit("send_name");
  });

  socket.on("sending_name", name => {
    socket.to(socket.roomID).emit("opponent_name", name);
  });

  socket.on("player_piecing_out", (name) => {
    socket.to(socket.roomID).emit("player_pieced_out", name);
  });

  socket.on("disconnect", (reason) => {
    //emit a notification to users on disconnection
    console.log("socket server DISconnection", reason);
  });
});

io.use((socket, next) => {
  const roomID = socket.handshake.auth.roomID;
  const userName = socket.handshake.auth.userName;
  const reJoin = socket.handshake.auth.userName;
  if (!roomID || !userName) {
    return next(new Error("missing game code"));
  }

  socket.roomID = roomID;
  socket.userName = userName;
  socket.reJoin = reJoin;
  next();
});

module.exports = app;
