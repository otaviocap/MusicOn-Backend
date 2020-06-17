import Mongoose from 'mongoose';

const UserSchema = new Mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    email: {
        type:String,
        unique: true,
        required: true
    },
    password: {
        type:String,
        required:true
    },
    playlists: [{
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'Playlist'
        }
    ],
})

export default Mongoose.model('User', UserSchema);