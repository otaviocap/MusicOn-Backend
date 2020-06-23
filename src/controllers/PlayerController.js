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
    const { username, socketId } = req.body
    if (roomId) {
        if (username && socketId) {
            try {
                const roomExists = await Room.findById(roomId)
                if (roomExists) {
                    roomExists.players.push({username, socketId})
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
            message: "Username or socketId not found"
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