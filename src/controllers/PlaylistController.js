import Users from '../models/User.js'
import Playlists from '../models/Playlist.js'
import SpotifyApi from '../services/SpotifyApi.js'
import SpotifyAuth from '../services/SpotifyAuth.js'
import Axios from 'axios'

//index, show, store, update, destroy
async function index(req, res) {}

async function store(req, res) {
    if (req.params.email) {
        const { email } = req.params
        const userExists = await Users.findOne({email})
        if (userExists) {
            try {
                const spotifyUrl = req.body.spotifyUrl
                const playlistId = spotifyUrl.slice(0, spotifyUrl.indexOf("?si")).slice("https://open.spotify.com/playlist/".length)
                const playlistInfo = (await Axios.get(`https://api.spotify.com/v1/playlists/1dEunNr2vUlqVazXUzsadO`, {
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
        message: "Email is required to search"
    })
}

async function destroy(req, res) {
    if (req.params.email) {
        const { email, playlistId } = req.params
        const userExists = await Users.findOne({email})
        if (userExists) {
            const playlistExists = await Playlists.findOne({owner: userExists._id, spotifyId: playlistId})
            if (playlistExists) {
                try {
                    console.log(playlistExists)
                    await Playlists.findByIdAndRemove(playlistExists._id)
                    userExists.playlists.pull({_id: playlistExists._id})
                    userExists.save()
                    console.log(userExists.playlists)
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
        message: "Email is required to search"
    })
}

export default {
    index,
    store,
    destroy
}
