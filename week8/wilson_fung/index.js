const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: { type: String }
})

const messageModel = mongoose.model("Message", messageSchema)

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/messages', async function(req, res){
  res.json(await messageModel.find());
});

io.on('connection', async function(socket){

    try {
        const messages = await messageModel.find({});
        socket.emit('message history', messages);
      } catch (err) {
        console.error('Error fetching message history:', err);
      }
      
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    const message = new messageModel();
    message.content = msg;
    message.save().then(m => {
      io.emit('chat message', msg);
    })
  });
});

server.listen(3000, async function(){
  await mongoose.connect("mongodb+srv://fungwilson3:4mAnXSHd0a3wfs23@cs198.jfzxf.mongodb.net/?retryWrites=true&w=majority&appName=CS198")
  console.log('listening on *:3000');
});


// // Once connected, send message of user connecting / disconnecting / messages
// io.on('connection', (socket) => {
//   // Log when a user connects
//   console.log('a user connected');

//   // Set default nickname
//   socket.nickname = 'Anonymous' + randomInt(1000).toString();

  
//   // Receive nickname from client
//   socket.on('set nickname', (nickname) => {
//     socket.nickname = nickname;
//     console.log(`${nickname} has joined`);
//     io.emit('chat message', `${nickname} has joined the chat`);
//   });

//   // Add "user" typing functionality
//   socket.on('typing', () => {
//     socket.broadcast.emit('typing', `${socket.nickname} is typing...`);
//   });

//   // Receive chat messages
//   socket.on('chat message', (msg) => {
//     io.emit('chat message', `${socket.nickname}: ${msg}`);
//   });

//   // Handle disconnect
//   socket.on('disconnect', () => {
//     console.log(`${socket.nickname} disconnected`);
//     io.emit('chat message', `${socket.nickname} has left the chat`);
//   });
// });