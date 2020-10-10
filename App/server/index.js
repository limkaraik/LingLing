const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
const http = require("http");
const socket = require("socket.io");

require('dotenv').config();

const server = http.createServer(app)
const io = socket(server);

// const formatMessage = require('./utils/message');
// const {
//   userJoin,
//   getCurrentUser,
//   userLeave,
//   getRoomUsers
// } = require('./utils/users');

//Connect MongoDB
const mongoose = require('mongoose');
const connect = mongoose
  .connect(process.env.MONGO_SECRET, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/meeting',require('./routes/meeting'));


// //socket
// const appName = "MOOZ Bot";

// // const users = {}; //for friends

// io.on('connection', socket => {
//     // if (!users[socket.id]) {  //for friends
    
//   //   socket.emit('init', socket.id)
//   //   socket.on('userData', userData =>{
//   //     users[socket.id] = {uid: userData._id, name: userData.name};
//   //     io.sockets.emit("allUsers", users);
//   //   })
//   // }

//   socket.on('joinRoom', ({ username, room }) => {
//     const user = userJoin(socket.id, username, room);

//     socket.join(user.room);

//     // Welcome current user
//     socket.emit('message', formatMessage(appName, 'Welcome to MOOZ!'));

//     // Broadcast when a user connects
//     socket.broadcast
//       .to(user.room)
//       .emit(
//         'message',
//         formatMessage(appName, `${user.username} has joined the chat`)
//       );

//     // Send users and room info
//     io.to(user.room).emit('roomUsers', {
//       room: user.room,
//       users: getRoomUsers(user.room)
//     });
//   });

//   socket.emit("yourID", socket.id);

//   // Listen for chatMessage
//   socket.on('chatMessage', msg => {
//     const user = getCurrentUser(socket.id);

//     io.to(user.room).emit('message', formatMessage(user.username, msg));
//   });
  
//   socket.on('disconnect', () => {
//       delete users[socket.id];
//       const user = userLeave(socket.id);
//       if (user) {
//         io.to(user.room).emit(
//           'message',
//           formatMessage(appName, `${user.username} has left the chat`)
//         );
  
//         // Send users and room info
//         io.to(user.room).emit('roomUsers', {
//           room: user.room,
//           users: getRoomUsers(user.room)
//         });
//       }
//   })

//   socket.on("callUser", (data) => {
//       io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
//   })

//   socket.on("acceptCall", (data) => {
//       io.to(data.to).emit('callAccepted', data.signal);
//   })
// });

const users = {};

io.on('connection', socket => {
  
  if (!users[socket.id]) {
    
    socket.emit('init', socket.id)
    socket.on('userData', ({name,room}) =>{
      users[socket.id] = { name:name,room:room};
      let sameRoom = {}
      for (let [key, value] of Object.entries(users)) {
        if (value.room == room){
          sameRoom[key] = value
        }
     }
      // console.log(sameRoom)
      io.sockets.emit("allUsers", sameRoom);
    })
  }
  
  
  // socket.emit("yourID", socket.id);
  
  socket.on('disconnect', (room) => {
      delete users[socket.id];
      let sameRoom = {}
      for (let [key, value] of Object.entries(users)) {
        if (value.room == room){
          sameRoom[key] = value
        }
     }
      // console.log(sameRoom)
      io.sockets.emit("dcUsers", sameRoom);
  })

  socket.on("callUser", (data) => {
      io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
  })

  socket.on("acceptCall", (data) => {
      io.to(data.to).emit('callAccepted', data.signal);
  })
});

const port = process.env.PORT;

server.listen(port, (error) => {
  if (error) {
    console.log(`Error ${error} has occurred when starting the server.`);
  }
  console.log(`Server running on ${port}`);
});