import axios from "axios"

export default axios.create({
    baseURL: 'http://api.spotify.com/v1'
})
