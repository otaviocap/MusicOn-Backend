const express = require("express");

const routes = express.Router();

routes.post('/data', (request, response) => {
    return response.json(
        request.body
    );
});


module.exports = routes;