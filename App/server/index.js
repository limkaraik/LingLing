const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
const http = require("http");
const socket = require("socket.io");

require('dotenv').config();

const server = http.createServer(app)
const io = socket(server);

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

//to retrieve images
app.use('/uploads', express.static('uploads'));

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
      socket.join(room)
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

  // Listen for chatMessage
  socket.on('sendMessage', ({msg,room}) => {
    let u = users[socket.id].name
    let data = { text:msg,user:u}
    io.to(room).emit('message', data);
  });

});

const port = process.env.PORT;

server.listen(port, (error) => {
  if (error) {
    console.log(`Error ${error} has occurred when starting the server.`);
  }
  console.log(`Server running on ${port}`);
});