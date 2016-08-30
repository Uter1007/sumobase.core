/* tslint:disable */
import 'reflect-metadata';
let chai = require('chai');
chai.use(require('chai-as-promised'));
let expect = chai.expect;
let sinon = require('sinon');
let request = require('supertest-as-promised');
let app = require('./fakes/app.fake');
/* tslint:enable */

describe('User Route Tests', () => {

    describe('Special Routes', () => {
        it('/Login Test', async () => {
            // noinspection TypeScriptValidateTypes
            await request(app)
                .post('/api/user/login')
                .type('form')
                .send({'email': 'christoph.ott@lean-coders.at', 'password': '123appTest$!'})
                .expect(200);
        });
        it('/Login Test; fails because of wrong password', async () => {
            // noinspection TypeScriptValidateTypes
            await request(app)
                .post('/api/user/login')
                .type('form')
                .send({'email': 'christoph.ott@lean-coders.at', 'password': '123appTest$!.wrong'})
                .expect(401);
        });
        it('/Login Test; fails because of inexistent user', async () => {
            // noinspection TypeScriptValidateTypes
            await request(app)
                .post('/api/user/login')
                .type('form')
                .send({'email': 'inexistent.user@somewhere.else', 'password': '123appTest$!.wrong'})
                .expect(401);
        });

    });

    describe('Restricted Routes Not LoggedIn', () => {
        it('/me Route Test', async () => {

            // noinspection TypeScriptValidateTypes
            await request(app)
                .get('/api/user/me')
                .expect(401);
        });
    });

    describe('Restricted Routes LoggedIn', () => {

        let agent = request.agent(app);
        beforeEach(async () => {
            // noinspection TypeScriptValidateTypes
            await agent
                .post('/api/user/login')
                .type('form')
                .send({'email': 'christoph.ott@lean-coders.at', 'password': '123appTest$!'});
        });

        describe('/me Route Test', () => {
            it('/Login Test; logged-in + able to call a protected route', async () => {
                // noinspection TypeScriptValidateTypes
                await agent
                    .get('/api/user/me')
                    .expect(200);
            });
        });

    });

    describe('Check', () => {

        it('/Check Test; e-mail address of existing user', async () => {
            let agent = request.agent(app);
            await agent
                .head('/api/user/check')
                .set('email', 'christoph.ott@lean-coders.at')
                .expect(404); // 404 = "already in use"
        });

        it('/Check Test; e-mail address of existing user', async () => {
            let agent = request.agent(app);
            await agent
                .head('/api/user/check')
                .set('email', 'somebody.else@somewhere.else')
                .expect(200); // 200 = "doesn't exist"
        });

    });
});
