import express = require('express');

let notFoundHandler = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) => {
    response.status(404).send('Sorry cant find that!');
};

export = notFoundHandler;
