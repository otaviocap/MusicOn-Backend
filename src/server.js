import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import routes from './routes.js';
import secret from './secret.js';

const app = express();
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
};
const dbUrl = `mongodb+srv://${secret.username}:${secret.password}@musicon-1czpl.gcp.mongodb.net/game?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, mongooseOptions);

// req query = Acessar query params (filtros) / post
// req.params =  Acessar params (edição, delete) / put
// req.body = acessar corpo / post

app.use(cors())
app.use(express.json());
app.use(routes);

app.listen(3333);