import Room from '../models/Room.js'
import Playlist from '../models/Playlist.js'

async function index(req, res) {
    try {
        const rooms = await Room.find({})
        if (rooms) {
            return res.status(200).json(rooms)
        }
        return res.status(404).json({
            message:"There isn't any room registered"
        })
    } catch (err) {
        if (err.response) {
            console.log(err.response)
        } else {
            console.log(err)
        }
    }
}

async function show(req,res) {
    const {roomId} = req.params
    if (roomId) {
        try {
            const roomExists = await Room.findById(roomId)
            if (roomExists) {
                return res.status(200).json(roomExists)
            }
            return res.status(404).json({
                message:"Room not found"
            })
        } catch (err) {
            if (err.response) {
                console.log(err.response)
            } else {
                // console.log(err)
            }
        }
    }
    return res.status(400).json({
        message: "Incorrect body"
    })
}

async function store(req, res) {
    const {playlistId, maxPlayers, maxScore} = req.body
    console.log(playlistId, maxPlayers, maxScore)
    if (playlistId && maxPlayers && maxScore) {
        try {
            const playlistExists = await Playlist.findById(playlistId)
            if (playlistExists) {
                const createdRoom = await Room.create({
                    playlistId,
                    maxPlayers,
                    maxScore
                })
                console.log(createdRoom)
                return res.status(200).json({
                    roomId: createdRoom._id
                })
            }
            return res.status(404).json({
                message:"Playlist not found"
            })
        } catch (err) {
            if (err.response) {
                console.log(err.response)
            } else {
                console.log(err)
            }
        }
    }
    return res.status(400).json({
        message: "Incorrect body"
    })
}

async function destroy(req, res) {
    const {roomId} = req.params
    if (roomId) {
        try {
            const roomExists = await Room.findByIdAndDelete(roomId)
            console.log(roomExists)
            if (roomExists) {
                return res.status(200).json({
                    message:"Room successfully removed"
                })
            }
            return res.status(404).json({
                message:"Room not found"
            })
        } catch (err) {
            if (err.response) {
                console.log(err.response)
            } else {
                console.log(err)
            }
        }
    }
    return res.status(400).json({
        message: "Incorrect body"
    })
}

export default {
    index,
    show,
    store,
    destroy
}