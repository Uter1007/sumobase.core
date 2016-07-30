import express = require('express');

let errorHandler = (
    err: Error,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) => {
    response.status(555).send('Something broke!');
};

export = errorHandler;
