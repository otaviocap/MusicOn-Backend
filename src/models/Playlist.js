import Mongoose from 'mongoose';

const PlaylistSchema = new Mongoose.Schema({
    spotifyUrl: {
        type:String,
        required: true
    },
    imageUrl: {
        type:String,
        required: true
    }
})

export default Mongoose.model('Playlist', PlaylistSchema);