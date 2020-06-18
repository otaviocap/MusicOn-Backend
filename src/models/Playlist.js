import Mongoose from 'mongoose';

const PlaylistSchema = new Mongoose.Schema({
    spotifyId: {
        type:String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type:String,
        required: true
    },
    owner: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

export default Mongoose.model('Playlist', PlaylistSchema);