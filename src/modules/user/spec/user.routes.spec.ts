/* tslint:disable */
import 'reflect-metadata';
let chai = require('chai');
chai.use(require('chai-as-promised'));
let expect = chai.expect;
let sinon = require('sinon');
let request = require('supertest');
let app = require('./fakes/app.fake');
/* tslint:enable */

describe('User Route Tests', () => {

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
