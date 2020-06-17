import Mongoose from 'mongoose';

const PlaylistSchema = new Mongoose.Schema({
    playlistId: {
        type:String,
        required: true
    },
    imageUrl: {
        type:String,
        required: true
    }
})

export default Mongoose.model('Playlist', PlaylistSchema);