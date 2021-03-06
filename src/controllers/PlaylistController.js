import Users from '../models/User.js'
import Playlists from '../models/Playlist.js'
import SpotifyAuth from '../services/SpotifyAuth.js'
import Axios from 'axios'

async function index(req, res) {
    if (req.params.input) {
        const { input } = req.params
        if (input.match(/\S+@\S+\.\S+/g)) {
            const userExists = await Users.findOne({input})
            if (userExists) {
                try {
                    const userPlaylists = await Playlists.find({owner: userExists._id})
                    return res.status(200).json(userPlaylists)
                } catch (err) {
                    console.log(err)
                    return res.status(403).json(err)
                }
            }
            return res.status(404).json({
                message: "User not found"
            })
        }
        try {
            const userPlaylists = await Playlists.find({owner: input})
            return res.status(200).json(userPlaylists)
        } catch (err) {
            console.log(err)
            return res.status(403).json(err)
        }
    }
    return res.status(400).json({
        message: "Input is required to search"
    })
}

async function store(req, res) {
    console.log(req.connectedUsers)
    if (req.params.input) {
        const { input } = req.params
        let userExists;
        if (input.match(/\S+@\S+\.\S+/g)) {
            userExists = await Users.findOne({input})
        } else {
            userExists = await Users.findById(input)
        } 
        if (userExists) {
            try {
                const spotifyUrl = req.body.spotifyUrl
                const playlistId = spotifyUrl.slice(0, spotifyUrl.indexOf("?si")).slice("https://open.spotify.com/playlist/".length)
                const playlistInfo = (await Axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                headers: {
                    'Authorization': 'Bearer ' + await SpotifyAuth.getToken()
                }
            }).catch((err) => console.log(err.response.data))).data
            console.log(playlistInfo)
            const playlistDocument = await Playlists.create({
                "spotifyId": playlistId,
                "name": playlistInfo.name,
                "image": playlistInfo.images[0].url,
                "owner": userExists._id
            })
            userExists.playlists.push(playlistDocument._id)
            userExists.save()
            return res.status(200).json({
                message: "Ok",
                "playlistInfo": playlistDocument
            })
        } catch (err) {
            console.log(err)
            return res.status(403).json(err)
        }
    }
    return res.status(404).json({
        message: "User not found"
    })
}
return res.status(400).json({
    message: "Input is required to search"
})
}

async function destroy(req, res) {
    if (req.params.input) {
        const { input, playlistId } = req.params
        console.log(input, playlistId)
        let userExists;
        if (input.match(/\S+@\S+\.\S+/g)) {
            userExists = await Users.findOne({input})
        } else {
            userExists = await Users.findById(input)
        }
        if (userExists) {
            const playlistExists = await Playlists.findOne({owner: userExists._id, spotifyId: playlistId})
            if (playlistExists) {
                try {
                    await Playlists.findByIdAndDelete(playlistExists._id)
                    await userExists.playlists.pull(playlistExists);
                    await userExists.save()
                    return res.status(200).json({
                        message: "Ok",
                        "userPlaylists": userExists.playlists
                    })
                } catch (err) {
                    console.log(err)
                    return res.status(403).json(err)
                }
            }
            return res.status(404).json({
                message: "Playlist not found"
            })
        }
        return res.status(404).json({
            message: "User not found"
        })
    }
    return res.status(400).json({
        message: "Input is required to search"
    })
}

export default {
    index,
    store,
    destroy
}
