require("dotenv").config();
const randRoom = require("./app/utilities/utils")
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./app/db/connect");
const cookieSession = require('cookie-session');
const http = require('http');
const socketio = require('socket.io')
const app = express();
const authRouter = require("./app/routes/auth");
const cors = require('cors');

app.use(cookieSession({
    name: 'session',
    secret: process.env.COOKIE_SECRET,
    maxAge: 24*60*60*1000,
    path: '/'
}));
app.use(express.json());
app.use(cookieParser());
app.use(process.env.API_KEY,authRouter);

const server = http.createServer(app)
const io = socketio(server)

// Code for creating rooms and joining roooms and all the socket related work. 
// probably to make it more modular I will separately write it in other files. (It will never happen and I know it.)

const rooms = new Map();
const roomOf = new Map();

//creates a new room
const createRoom = (socket,userid) => {
    var newRoom = randRoom()
    while (rooms.has(newRoom)){
        newRoom = randRoom().toUpperCase();
    }
    rooms.set(newRoom.toUpperCase(), {roomId: newRoom.toUpperCase(), socketid:[socket.id], board:null});
    roomOf.set(socket.id,newRoom.toUpperCase());
    return newRoom;
}

// //Put the newly joined player into a room's player list 
// const joinRoom = (player, room) => {
//     currentRoom = rooms.get(room)
//     updatedPlayerList = currentRoom.players.push(player)
//     updatedRoom = {...currentRoom, players:updatedPlayerList}
// }

io.on('connection', socket =>{

    console.log('A client connected');
    
    socket.on('disconnect', () => {
        if(roomOf.get(socket.id) === undefined) return;
        const room1 = rooms.get(roomOf.get(socket.id));
        if(room1.socketid.length > 1) {
            opp = room1.socketid[0] === socket.id ? room1.socketid[1] : room1.socketid[0];
            io.to(opp).emit('playerLeft');
        }
        console.log('disconnect')
        if(roomOf.has(socket.id)) {
            const modified = rooms.get(roomOf.get(socket.id)).socketid.filter(sid => sid != socket.id);
            rooms.get(roomOf.get(socket.id)).socketid = modified;
            if(rooms.get(roomOf.get(socket.id)).socketid.length === 0) {
                rooms.delete(roomOf.get(socket.id));
            }
        }
        roomOf.delete(socket.id)
    });

    //On the client submit event (on start page) to create a new room
    socket.on('newGame', ({userid}) => {
        const room = createRoom(socket,userid);
        socket.emit('newGameCreated', room)
    })

    socket.on('changed', ({oppSid, answered, score}) => {
        io.to(oppSid).emit('listenChange', {answered, score});
    })

    //send data to fellow player.
    socket.on('setDataOtherPlayer', ({oppSid, crossword, answered, oppName}) => {
        io.to(oppSid).emit('setDataPlayer2', {oppSid: socket.id, crossword, answered, oppName});
    }) 

    //On the client submit event (on start page) to join a room
    socket.on('joining', ({room, userid}) => {
        if (rooms.has(room)){
            roomOf.set(socket.id, room);
            otherPlayer = rooms.get(room).socketid[0];
            rooms.get(room).socketid = [otherPlayer, socket.id];
            io.to(otherPlayer).emit('setDataHost', {oppName: userid, oppSid: socket.id});
        }else{
            socket.emit('errorMessage', 'No room with that id found')
        }
    })
})

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Welcome to the entry page!');
});
  
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log("error => ",error);
    }
};

start();
