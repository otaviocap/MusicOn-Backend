import Mongoose from 'mongoose';

const PlaylistSchema = new Mongoose.Schema({
    maxPlayers: Number,
    maxScore: Number,
    playlistId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Playlist"
    },
    players: [{
        username: {
            type: String,
            sparse: true,
            unique: true,
        },
        score: {
            type: Number,
            default: 0
        },
        state: {
            type: String,
            enum: ['first', 'second', 'third', 'both', 'one', 'none'],
            default: 'none'
        }
    }]
})

export default Mongoose.model('Room', PlaylistSchema);