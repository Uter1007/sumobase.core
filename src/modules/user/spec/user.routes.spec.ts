import 'reflect-metadata';

/* tslint:disable */
let chai = require('chai');
chai.use(require('chai-as-promised'));
let expect = chai.expect;
let sinon = require('sinon');
let request = require('supertest');
let agent = require('superagent');
/* tslint:enable */


describe('User Route Tests', () => {

    describe('Restricted Routes Not LoggedIn', () => {
        it('/me Route Test', (done) => {
            // https://github.com/inversify/inversify-express-utils/blob/35241bb5e17bc372e64b491ce3bcd64fa4105303/test/framework.test.ts
        });
    });
});
