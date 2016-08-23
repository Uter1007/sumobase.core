/* tslint:disable */
let chai = require('chai');
chai.use(require('chai-as-promised'));
let expect = chai.expect;
let sinon = require('sinon');
let request = require('supertest');
import kernel from './helper/user.kernel.test.helper';
import 'reflect-metadata';
import * as expressutils from 'inversify-express-utils';

import session = require('express-session');

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as passport from 'passport';

import errorHandler = require('../../../modules/commons/error/middleware/error.handler.logic');
import notFoundHandler = require('../../../modules/commons/error/middleware/notfound.handler.logic');
import supertest = require('supertest');

require('./fakes/passport.fake.strategy');

/* tslint:enable */


describe('User Route Tests', () => {

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

    describe('Special Routes', () => {
        it('/Login Test', (done) => {
            // noinspection TypeScriptValidateTypes
            request(app)
                .post('/api/user/login')
                .type('form')
                .send({'email': 'christoph.ott@lean-coders.at', 'password': '123appTest$!'})
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    } else {
                        done();
                    }
                });
        });
        it('/Login Test; fails because of wrong password', (done) => {
            // noinspection TypeScriptValidateTypes
            request(app)
                .post('/api/user/login')
                .type('form')
                .send({'email': 'christoph.ott@lean-coders.at', 'password': '123appTest$!.wrong'})
                .expect(401)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    } else {
                        done();
                    }
                });
        });
        it('/Login Test; fails because of inexistent user', (done) => {
            // noinspection TypeScriptValidateTypes
            request(app)
                .post('/api/user/login')
                .type('form')
                .send({'email': 'inexistent.user@somewhere.else', 'password': '123appTest$!.wrong'})
                .expect(401)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    } else {
                        done();
                    }
                });
        });

    });

    describe('Restricted Routes Not LoggedIn', () => {
        it('/me Route Test', (done) => {

            // noinspection TypeScriptValidateTypes
            request(app)
                .get('/api/user/me')
                .expect(401)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    } else {
                        done();
                    }
                });
        });
    });

    describe('Restricted Routes LoggedIn', () => {

        let agent = request.agent(app);
        beforeEach(function(done){
            // noinspection TypeScriptValidateTypes
            agent
                .post('/api/user/login')
                .type('form')
                .send({'email': 'christoph.ott@lean-coders.at', 'password': '123appTest$!'})
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    } else {
                        done();
                    }
                });
        });

        describe('/me Route Test', () => {
            it('/Login Test; logged-in + able to call a protected route', (done) => {
                // noinspection TypeScriptValidateTypes
                agent
                    .get('/api/user/me')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            done();
                        }
                    });
            });
        });

    });
});