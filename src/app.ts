import {InversifyExpressServer} from 'inversify-express-utils';
import {Bootstrap} from './bootstrap';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as passport from 'passport';
/* tslint:disable */
require('./modules/authenticate/strategy/passport');
import * as testConfigFile from './config/env/testconfig';
/* tslint:enable */

import session = require('express-session');

import errorHandler = require('./modules/error/middleware/error.handler.logic');
import notFoundHandler = require('./modules/error/middleware/notfound.handler.logic');

let kernel = new Bootstrap().getKernel();

// start the server
let server = new InversifyExpressServer(kernel);
server.setConfig((app) => {
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(helmet());

    app.use(session({ resave: false, saveUninitialized: true, secret: 'utersfirsttry' }));
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    app.post('/login', passport.authenticate('local', {
        failureRedirect : '/login2',
        successRedirect : '/api/v1.0/user/settings'
    }));
});

// generic Error Handler
server.setErrorConfig((app) => {
    app.use(errorHandler);
});

let app = server.build();

// 404 Error Handler
app.use(notFoundHandler);

app.listen(3000);
console.log('Server started on port 3000 :)');

exports = module.exports = app;
