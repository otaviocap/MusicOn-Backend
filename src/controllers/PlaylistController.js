import Users from '../models/User.js'
import Playlist from '../models/Playlist.js'
import SpotifyApi from '../services/SpotifyApi.js'

//index, show, store, update, destroy
async function index(req, res) {}

async function show(req, res) {}

async function store(req, res) {
    if (req.params.email) {
        const { email } = req.params
        const userExists = await Users.findOne({email})
        if (userExists) {
            const spotifyUrl = req.body.spotifyUrl
            const playlistId = spotifyUrl.slice(0, spotifyUrl.indexOf("?si")).slice("https://open.spotify.com/playlist/".length)
            const playlistInfo = await SpotifyApi.get(`/playlists/${playlistId}`).catch((err) => console.log(err))
            // const playlistDocument = await Playlist.create({
            //     playlistId
            // })
            // userExists.playlists.push(playlist._id)
            // userExists.save()
        }
        return res.status(404).json({
            message: "User not found"
        })
    }
    return res.status(400).json({
        message: "Email is required to search"
    })
}

async function update(req, res) {}

async function destroy(req, res) {}

export default {
    index,
    show,
    store,
    update,
    destroy
}
