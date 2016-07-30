import express = require('express');

let requestAuthenticater: express.RequestHandler = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) => {
    if (request.isAuthenticated()) {
        return next();
    }
    // in any other case, redirect to the home
    response.redirect('/login');
};

export = requestAuthenticater;
