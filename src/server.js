import express from 'express';
import mongoose from 'mongoose';
import socketio from 'socket.io'
import cors from 'cors'
import routes from './routes.js';
import secret from './secret.js';

const app = express();
const server = app.listen(3333)
const io = socketio.listen(server, {
    serveClient: false
})

const roomAndUsers = {}

io.on("connection", socket => {
    const { roomId, username } = socket.handshake.query
    if (roomAndUsers[roomId]) {
        roomAndUsers[roomId].push(socket.id)
    } else {
        roomAndUsers[roomId] = [socket.id]
    }
    console.log("Client logged: " + username)
})


const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
};
const dbUrl = `mongodb+srv://${secret.username}:${secret.password}@musicon-1czpl.gcp.mongodb.net/game?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, mongooseOptions);

// req query = Acessar query params (filtros) / post
// req.params =  Acessar params (edição, delete) / put
// req.body = acessar corpo / post

app.use((req, res, next) => {
    req.io = io;
    req.roomAndUsers = roomAndUsers

    return next()
})
const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000'
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(routes);