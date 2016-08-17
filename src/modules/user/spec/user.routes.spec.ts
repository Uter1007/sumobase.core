import 'reflect-metadata';
import * as expressutils from 'inversify-express-utils';

/* tslint:disable */
let chai = require('chai');
chai.use(require('chai-as-promised'));
let expect = chai.expect;
let sinon = require('sinon');
let request = require('supertest');
let agent = require('superagent');
/* tslint:enable */


describe('User Route Tests', () => {

    let server: expressutils.interfaces.InversifyExpressServer;
    let kernel: inversify.interfaces.Kernel;

    beforeEach(function(){

    });

    afterEach(function(){

    });

    describe('Restricted Routes Not LoggedIn', () => {
        it('/me Route Test', (done) => {

            server = new expressutils.InversifyExpressServer(kernel);
        });
    });
});
