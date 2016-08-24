import {InversifyExpressServer} from 'inversify-express-utils';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as passport from 'passport';
import * as mongoose from 'mongoose';
import * as express from 'express';

import session = require('express-session');

/* tslint:disable */
import kernel from './bootstrap';
let MongoStore = require('connect-mongo')(session);
/* tslint:enable */

import errorHandler = require('./modules/commons/error/middleware/error.handler.logic');
import notFoundHandler = require('./modules/commons/error/middleware/notfound.handler.logic');

import configLoader from './modules/commons/configloader/configloader.service';
import {PassportMiddleware} from './modules/commons/authenticate/middleware/passport.middleware';
import MIDDLEWARE_TAGS from './constants/middleware.tags';
import {Strategy} from 'passport-local';

const config = configLoader.getConfig();

mongoose.connect(config.db.uri, {
    pass: config.db.password,
    user: config.db.username,
});

process.setMaxListeners(0);

// start the server
let server = new InversifyExpressServer(kernel);
server.setConfig((app) => {
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(helmet());

    app.use(session({ resave: false,
                      saveUninitialized: true,
                      secret: config.passwordHandler.sessionPw,
                      store: new MongoStore( {mongooseConnection: mongoose.connection})
                    }));

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    app.use('/documentation', express.static(__dirname + '/public/documentation/api'));

});

// generic Error Handler1
server.setErrorConfig((app) => {
    app.use(errorHandler);
});

let app = server.build();

// passport configuration
let passportManagement = kernel.get<PassportMiddleware>(MIDDLEWARE_TAGS.PassportMiddleware);

passport.serializeUser(function(user, done) {
    passportManagement.serializeUser(user, done);
});

passport.deserializeUser(async function(id, done) {
    await passportManagement.deserializeUser(id, done);
});

passport.use(new Strategy(
    {
        passReqToCallback: true,
        usernameField: 'email'
    },
    async function(req, email, password, done) {
        await passportManagement.localStrategy(req, email, password, done);
    }
));

// 404 Error Handler
app.use(notFoundHandler);

app.listen(3000);
console.log('Server started on port 3000 :)');

exports = module.exports = app;
