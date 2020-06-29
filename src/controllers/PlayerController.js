import Room from '../models/Room.js'

async function show(req, res) {
    const { roomId } = req.params
    if (roomId) {
            try {
                const roomExists = await Room.findById(roomId)
                if (roomExists) {
                    return res.status(200).json(roomExists.players)
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
        message: "Incorrect params"
    })
}

async function store(req, res) {
    const { roomId } = req.params
    const { username } = req.body
    if (roomId) {
        if (username) {
            try {
                const roomExists = await Room.findById(roomId)
                if (roomExists) {
                    if (roomExists.players.length + 1 <= roomExists.maxPlayers) {
                        for (const player of roomExists.players) {
                            if (player.username === username) {
                                return res.status(409).json({
                                    message: "User already in the room"
                                })
                            }
                        }
                        roomExists.players.push({username})
                        roomExists.save()
                        return res.status(200).json(roomExists)
                    }
                    return res.status(409).json({
                        message: "Room is full"
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
            message: "Username not found"
        })
    }
    return res.status(400).json({
        message: "Incorrect params"
    })
}

async function update(req, res) {
    const { roomId, playerId } = req.params
    const { score, state } = req.body
    if (roomId) {
            try {
                const roomExists = await Room.findById(roomId)
                if (roomExists) {
                    const playerToUpdate = roomExists.players.id(playerId)
                    if (playerToUpdate) {
                        if (score) {
                            playerToUpdate.score = score
                        }
                        if (state) {
                            if (['first', 'second', 'third', 'both', 'one', 'none'].includes(state)) {
                                playerToUpdate.state = state
                            }
                        }
                        roomExists.save()
                        return res.status(200).json(roomExists)
                    }
                    return res.status(404).json({
                        message: "User not found"
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
        message: "Incorrect params"
    })
}

async function destroy(req, res) {
    const { roomId, playerId } = req.params
    if (roomId) {
            try {
                const roomExists = await Room.findById(roomId)
                if (roomExists) {
                    roomExists.players.pull({_id: playerId})
                    roomExists.save()
                    return res.status(200).json(roomExists)
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
        message: "Incorrect params"
    })
}

export default {
    store,
    destroy,
    show,
    update
}