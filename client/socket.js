import { io } from "socket.io-client";

const URL = "http://localhost:8080";
const socket = io({ URL, autoConnect: false });

// socket.onAny((event, ...args) => {
//   //logs client socket events
//  console.log("client socket event", event, args);
// });


//add session data for re-connecting to sockets
//include game id


socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
  //disconnect socket here?
});

// socket.on("users", (users) => {
//   users.forEach((user) => {
//     user.self = user.userID === socket.id;
//     // initReactiveProperties(user);
//   });
  // put the current user first, and then sort by username
  // this.users.sort((a, b) => {
  //   if (a.self) return -1;
  //   if (b.self) return 1;
  //   if (a.username < b.username) return -1;
  //   return a.username > b.username ? 1 : 0;
  // });
// });

// socket.on("user connected", (user) => {
//   // initReactiveProperties(user);
// //use this to notify users of new login
// });

export default socket;
