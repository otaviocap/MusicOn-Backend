/*
*   This file contains all the information to connect to an MongoDB Server
*   if you want to use the aplication, just add put your credentials here
*   
*   ==============================IMPORTANT==============================
*             Rename this file to secret.js to work properly
*/

export default {
    username: "Your MongoDB Username with read and write permissions",
    password: "Your MongoDB Password",
    key: "A key to verify identity in all important requests and db operations",
    spotifyClientPublic: "You need to register your application at the spotify developer dashboard to get this key",
    spotifyClientSecret: "You need to register your application at the spotify developer dashboard to get this key"
}