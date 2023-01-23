const express = require("express");
const app = express();

const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

app.use(cors()); //express enabling cors


const server = http.createServer(app); //out http server cors enabled

server.listen(4004, () => {
    console.log("App listening");
})

const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080"
    }
});

io.on("connection", (socket) => {
    console.log(`connected to ${socket.id}`);
    socket.on("send_message", ({ message }) => { /* the name listens to a special message route */
        console.log(message);
        socket.broadcast.emit("yall", { message }) /* socket ensures that id is emiting, io emit does all */
    });

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log("Room Joined", data);
    });

    socket.on("send_message_to_room", (data) => {
        socket.to(data.room).emit("receive_message_to_room", data.message);
    })


});