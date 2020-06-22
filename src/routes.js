import UserController from './controllers/UserController.js';
import PlaylistsController from './controllers/PlaylistController.js';
import express from "express";
import SpotifyAuth from './services/SpotifyAuth.js';
import Auth from './services/Auth.js';
import RoomController from './controllers/RoomController.js';

const routes = express.Router();

//User api
routes.post('/api/users/', UserController.store);
routes.get('/api/users/', UserController.index);
routes.get('/api/users/:email', UserController.show);
routes.delete('/api/users/:email', UserController.destroy);
routes.patch('/api/users/:email', UserController.update);

//Playlist api
routes.post('/api/users/:input/playlists/', PlaylistsController.store);
routes.get('/api/users/:input/playlists/', PlaylistsController.index);
routes.delete('/api/users/:input/playlists/:playlistId', PlaylistsController.destroy);

//Auth
routes.post('/api/auth', Auth.login);

//Room api
routes.post("/api/rooms/", RoomController.store)
routes.get("/api/rooms/", RoomController.index)
routes.delete("/api/rooms/:roomId/", RoomController.destroy)
routes.get("/api/rooms/:roomId/", RoomController.show)



export default routes;