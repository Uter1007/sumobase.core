/* tslint:disable */
import 'reflect-metadata';
let chai = require('chai');
chai.use(require('chai-as-promised'));
let expect = chai.expect;
let sinon = require('sinon');
let request = require('supertest');

import 'reflect-metadata';
import * as expressutils from 'inversify-express-utils';
import session = require('express-session');
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as passport from 'passport';
import {Strategy} from 'passport-local';

import errorHandler = require('../../../../core/error/middleware/error.handler.logic');
import notFoundHandler = require('../../../../core/error/middleware/notfound.handler.logic');

import kernel from '../helper/user.kernel.test.helper';
import {PassportMiddleware} from '../../../../core/authenticate/middleware/passport.middleware';
import MIDDLEWARE_TAGS from '../../../../../constants/middleware.tags';

/* tslint:enable */

let server: expressutils.interfaces.InversifyExpressServer;
let app: Express.Application;
server = new expressutils.InversifyExpressServer(kernel);

server.setConfig((exApp) => {
    exApp.use(cookieParser());
    exApp.use(bodyParser.json());
    exApp.use(bodyParser.urlencoded({extended: true}));
    exApp.use(helmet());

    exApp.use(session({
        resave: false,
        saveUninitialized: true,
        secret: 'testing',
    }));
    exApp.use(passport.initialize());
    exApp.use(passport.session()); // persistent login sessions

});


// generic Error Handler1
server.setErrorConfig((exApp) => {
    exApp.use(errorHandler);
});

app = server.build();

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

exports = module.exports = app;
