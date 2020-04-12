const express = require('express');
const mongoose = require('mongoose')
const routes = require('./routes');
const secret = require('./secret')

const app = express();
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const dbUrl = `mongodb+srv://${secret.username}:${secret.password}@cluster0-i1dfs.gcp.mongodb.net/test?retryWrites=true&w=majority"`;

mongoose.connect(dbUrl, mongooseOptions);

// req query = Acessar query params (filtros) / post
// req.params =  Acessar params (edição, delete) / put
// req.body = acessar corpo / post

app.use(express.json());
app.use(routes);

app.listen(3333);