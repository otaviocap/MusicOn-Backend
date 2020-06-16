import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js';
import secret from './secret.js';

const app = express();
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const dbUrl = `mongodb+srv://${secret.username}:${secret.password}@musicon-1czpl.gcp.mongodb.net/Game?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, mongooseOptions);

// req query = Acessar query params (filtros) / post
// req.params =  Acessar params (edição, delete) / put
// req.body = acessar corpo / post

app.use(express.json());
app.use(routes);

app.listen(3333);