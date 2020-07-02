import room from '../models/Room.js'
import SpotifyAuth from './SpotifyAuth.js'
import Axios from 'axios'
import Playlist from '../models/Playlist.js'

const roomConfigs = {}

function registerAndHandleEvents(io) {
    room.deleteMany({}, ()=>{console.log("Cleared all the rooms")})
    io.on("connection", async socket => {
        const { roomId, username } = socket.handshake.query
        socket.join(roomId)
        socket.to(roomId).emit("addPlayer", {username})
        console.log("Client connected: " + username + " in the roomId: " + roomId)
        if (!roomConfigs[roomId]) {
            roomConfigs[roomId] = {}
            roomConfigs[roomId].winState = false
            roomConfigs[roomId].players = 0
            roomConfigs[roomId].isLoaded = false
            roomConfigs[roomId].roomDocument = await room.findById(roomId)
            roomConfigs[roomId].playlistDocument = await Playlist.findById(roomConfigs[roomId].roomDocument.playlistId)
            roomConfigs[roomId].spotifyPlaylist = (await Axios.get(`https://api.spotify.com/v1/playlists/${roomConfigs[roomId].playlistDocument.spotifyId}/tracks?market=BR`, {
                headers: {
                    'Authorization': 'Bearer ' + await SpotifyAuth.getToken()
                }
            }).catch((err) => console.log(err.response.data))).data
            roomConfigs[roomId].gameIsStarted = false
            roomConfigs[roomId].isLoaded = true
        }
        roomConfigs[roomId].players++

        let invalid = false
        const invalidSongs = roomConfigs[roomId].spotifyPlaylist.items.filter((item) => {if (item.track.preview_url === null) return(item.track.name)})
        if (invalidSongs.lenght >= roomConfigs[roomId].spotifyPlaylist.items.lenght) {
            invalid = true
        }

        const tryToStart = async () => {
            if (!roomConfigs[roomId].gameIsStarted) {
                if (roomConfigs[roomId].players >= 2) {
                    if (!roomConfigs[roomId].winState) {
                        if (roomConfigs[roomId].spotifyPlaylist) {
                            if (invalid) {
                                socket.to(roomId).emit("newMessage", {
                                    message: "Sorry, but your playlist only have invalid song, please create another room with other playlist"
                                })
                            } else {
                                const roomExists = await room.findById(roomId)
                                roomExists.players.forEach((player) => player.state = "none")
                                roomExists.save()
                                const songs = roomConfigs[roomId].spotifyPlaylist.items
                                let randomSong = songs[Math.floor(Math.random() * songs.length)].track
                                while (randomSong.preview_url === null) {
                                    randomSong = songs[Math.floor(Math.random() * songs.length)].track
                                }
                                console.log({
                                    songName: randomSong.name,
                                    artist: randomSong.artists[0].name,
                                    album: randomSong.album.name,
                                    img: randomSong.album.images[1].url,
                                    spotifyLink: randomSong.external_urls.spotify,
                                    previewAudio: randomSong.preview_url 
                                })
                                io.to(roomId).emit("startGame", {
                                    songName: randomSong.name,
                                    artist: randomSong.artists[0].name,
                                    album: randomSong.album.name,
                                    img: randomSong.album.images[1].url,
                                    spotifyLink: randomSong.external_urls.spotify,
                                    previewAudio: randomSong.preview_url 
                                })
                                roomConfigs[roomId].gameIsStarted = true
                                setTimeout(() => {roomConfigs[roomId].gameIsStarted = false; tryToStart()}, 1000 * 35)
                            }
                        } 
                    } else {
                        const roomExists = await room.findById(roomId)
                        roomExists.players.forEach((player) => {player.state = "none"; player.score = 0})
                        roomExists.save()
                        io.to(roomId).emit("winState")
                        roomConfigs[roomId].winState = false
                        setTimeout(() => {roomConfigs[roomId].gameIsStarted = false; tryToStart()}, 1000 * 5)
                    }
                }
            }
        }
        tryToStart()

        socket.on("disconnect", async () => {
            socket.leave(roomId)
            socket.to(roomId).emit("removePlayer", {username})
            const roomDocument = await room.findById(roomId)
            const player = await roomDocument.players.find((item) => item.username === username)
            roomDocument.players.pull({_id: player._id})
            roomDocument.save()
            roomConfigs[roomId].players--
            if (roomConfigs[roomId].players === 0) {
                const checkForEnd = async () => {
                    if (roomConfigs[roomId].players === 0) {
                        await room.findByIdAndDelete(roomId)
                        console.log("Cleared an empty room, with the id " + roomId)
                    }
                }
                setTimeout(checkForEnd, 10000)
            }
            console.log("Client disconnected: " + username + " in the roomId: " + roomId)

            if (roomConfigs[roomId].gameIsStarted) {
                if (roomDocument.players.lenght < 2) {
                    roomConfigs[roomId].gameIsStarted = false
                    io.to(roomId).emit("pauseGame")
                }
            }
        })

        socket.on("newMessage", (command) => {
            io.to(command.roomId).emit("newMessage", command)
        })

        socket.on("correctAnswer", async () => {
            const roomDocument = await room.findById(roomId)
            const player = await roomDocument.players.find((item) => item.username === username)
            let newScore = player.score
            let nextState = "one"
            if (player.state === "one") {
                nextState = "first"
                for (const player of roomDocument.players) {
                    if (player.state === "first" && !(["second", "third", "both"].includes(nextState))){
                        nextState = "second"
                    } else if (player.state === "second" && !(["third", "both"].includes(nextState))) {
                        nextState = "third"
                    } else if (player.state === "third") {
                        nextState = "both"
                    }
                }
            }
            switch (nextState) {
                case "one":
                    newScore += 2;
                    break;
                case "first":
                    newScore += 8
                    break;
                case "second":
                    newScore += 6;
                    break;
                case "third":
                    newScore += 4;
                    break;
                case "both":
                    newScore += 2;
                    break;
            }
            player.score = newScore
            player.state = nextState
            roomDocument.save()
            if (newScore >= roomDocument.maxScore) {
                roomConfigs[roomId].winState = true
            }
            console.log("Correct answer by " + username + " next state will be " + nextState)
            io.to(roomId).emit("changeState", {
                username,
                state: nextState,
                score: newScore
            })
        })
    })
}

export default {
    registerAndHandleEvents
}