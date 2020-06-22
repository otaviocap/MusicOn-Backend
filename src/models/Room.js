import Mongoose from 'mongoose';

const PlaylistSchema = new Mongoose.Schema({
    maxPlayers: Number,
    maxScore: Number,
    playlistId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Playlist"
    },
    players: [{
        username: String,
        score: Number,
        state: {
            type: String,
            enum: ['first', 'second', 'third', 'both', 'one', 'none'],
            default: 'none'
        },
        socketId: String 
    }]
})

export default Mongoose.model('Room', PlaylistSchema);