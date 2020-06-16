import UserController from './controllers/UserController.js';
import express from "express";

const routes = express.Router();
routes.post('/api/users/', UserController.store);
routes.get('/api/users/:email', UserController.show);
routes.delete('/api/users/:email', UserController.destroy);


export default routes;