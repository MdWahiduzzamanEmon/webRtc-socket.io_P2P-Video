//express and socket io
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.ORIGIN || "*",
  },
});

app.use(cors());

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.send("Hello World!");
});
//add cors 


const emailToSocketMaping = new Map();
const socketToEmailMaping = new Map();

io.on("connection", function (socket) {
  console.log("a user connected");
  socket.on("join-room", (data) => {
    console.log(data);
    const { roomId, emailId } = data;
    emailToSocketMaping.set(emailId, socket.id); 
    socketToEmailMaping.set(socket.id, emailId);
    socket.join(roomId);
    socket.emit("joined-room", { roomId });
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
  });

  socket.on("call-user", (data) => {
    const { offer,emailId } = data;
    const fromEmail = socketToEmailMaping.get(socket.id);
    const socketId = emailToSocketMaping.get(emailId);
    socket.to(socketId).emit("incoming-call", { offer, from: fromEmail });

  });

  socket.on("call-accepted", (data) => {
    const { answer, emailId } = data;
    const socketId = emailToSocketMaping.get(emailId);
    socket.to(socketId).emit("call-accepted", { answer });
    
  });

});


server.listen(4000, function () {
  console.log(`listening on : http://localhost:4000`);
});
