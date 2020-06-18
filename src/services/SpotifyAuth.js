import redis from './RedisServer.js'
import secret from '../secret.js'
import axios from 'axios'

async function getToken(req, res) {
    const spotifyToken = await redis.get("spotifyToken")
    if (!(spotifyToken)) {
        try {
            const token = await axios.post("https://accounts.spotify.com/api/token", null, {
                params: {
                    grant_type: "client_credentials"
                },
                headers: {
                    "Authorization":`Basic ${Buffer.from(secret.spotifyClientPublic+":"+secret.spotifyClientSecret).toString('base64')}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })
            redis.set("spotifyToken", token.data.access_token, "EX", token.data.expires_in)
            return token.data.access_token
        } catch (error) {
            console.log(error.response.data)
        }
    }
    return spotifyToken
}


export default {
    getToken
}