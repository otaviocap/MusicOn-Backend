import room from '../models/Room.js'

function registerAndHandleEvents(io) {
    // room.deleteMany({}, ()=>{console.log("Cleared all the rooms")})
    io.on("connection", socket => {
        const { roomId, username } = socket.handshake.query
        socket.join(roomId)
        socket.to(roomId).emit("addPlayer", {username})
        console.log("Client connected: " + username + " in the roomId: " + roomId)

        socket.on("disconnect", async () => {
            socket.leave(roomId)
            socket.to(roomId).emit("removePlayer", {username})
            const roomDocument = await room.findById(roomId)
            roomDocument.players.pull({username})
            console.log("Client disconnected: " + username + " in the roomId: " + roomId)
        })

        socket.on("newMessage", (command) => {
            console.log(command)
            io.to(command.roomId).emit("newMessage", command)
        })
    })
}

export default {
    registerAndHandleEvents
}