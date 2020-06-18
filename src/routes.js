import UserController from './controllers/UserController.js';
import PlaylistsController from './controllers/PlaylistController.js';
import express from "express";
import SpotifyAuth from './services/SpotifyAuth.js';

const routes = express.Router();

//User Api
routes.post('/api/users/', UserController.store);
routes.get('/api/users/', UserController.index);
routes.get('/api/users/:email', UserController.show);
routes.delete('/api/users/:email', UserController.destroy);
routes.patch('/api/users/:email', UserController.update);
routes.post('/api/users/:email/playlists/', PlaylistsController.store);
routes.delete('/api/users/:email/playlists/:playlistId', PlaylistsController.destroy);


export default routes;