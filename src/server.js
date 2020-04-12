const express = require('express');

const app = express();

// req query = Acessar query params (filtros) / post
// req.params =  Acessar params (edição, delete) / put
// req.body = acessar corpo / post

app.use(express.json());

app.post('/data', (request, response) => {
    return response.json(
        request.body
    );
});

app.listen(3333);