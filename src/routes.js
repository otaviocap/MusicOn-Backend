import PlaylistsController from './controllers/PlaylistController.js';
import PlayerController from './controllers/PlayerController.js';
import UserController from './controllers/UserController.js';
import RoomController from './controllers/RoomController.js';
import Auth from './services/Auth.js';
import express from "express";
import TestController from './controllers/TestController.js';

const routes = express.Router();

//User api
routes.post('/api/users/', UserController.store);
routes.get('/api/users/', UserController.index);
routes.get('/api/users/:input', UserController.show);
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

//Players api
routes.get('/api/rooms/:roomId/players/', PlayerController.show)
routes.post('/api/rooms/:roomId/players', PlayerController.store)
routes.delete('/api/rooms/:roomId/players/:playerId', PlayerController.destroy)
routes.patch('/api/rooms/:roomId/players/:playerId', PlayerController.update)

//Test api
routes.get('/api/test', TestController.test)

export default routes;