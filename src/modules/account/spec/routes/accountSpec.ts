'use strict';
import {mochaAsync} from '../../../../commons/testing/mocha/asyncAwait';

import {AccountRepository} from '../../logic/accountRepository';
import {Request, Response} from 'express';

import * as superRequest from 'supertest';
import app from './../../../../app';

// import * as Promise from 'bluebird';

import {accountModel, AccountState} from '../../models/accountModel';
import {AccountController} from '../../controllers/accountController';
import {AccountService} from '../../logic/accountService';
import {
    AccountAlreadyInUseException,
    AccountNameNotValidException,
    AccountCheckInvalid,
} from '../../../errors/models/userMgmtExceptions';

let moment = require('moment');
let sinon = require('sinon');
// let expect = require('chai').expect;

describe('Account Route Tests @IntegrationTests', () => {

    it('should get 433 response from checkAccountName @IntegrationTest', mochaAsync(async () => {
        let repo = new AccountRepository();
        let accountName = 'tester';
        const newAccount = new accountModel({
            activatedOn: moment(),
            createdOn: moment(),
            name: accountName,
            state: AccountState.PENDING,
        });
        await repo.create(newAccount);
        await superRequest(app)
            .post('/api/accounts/check')
            .type('json')
            .send({'name': 'tester'})
            .expect(433);

        // console.log(resp);
    }));

    it('should get 200 response from checkAccountName @IntegrationTest', mochaAsync(async () => {
        await superRequest(app)
            .post('/api/accounts/check')
            .type('json')
            .send({'name': 'someoneelse'})
            .expect(200);
    }));

});

describe('Account Controller Tests @UnitTests', () => {
    let accountService;
    let accMock;
    let resMock;
    let nextMock;

    let res: Response;
    let req: Request;

    // Stubs and Spys would be better (documentation of Sinon), but I don't have a glue how to setup it :(
    // maybe a typescript Problem... this._accountService was always undefined or an async / await problem
    // I don't know but with mocks it works like a charm
    beforeEach(function() {
        accountService = new AccountService();
        res = <any>{
            sendStatus: function(num) {
                return;
            },
        };
        req = <any>{
            body: {
                name: 'test',
            },
        };

        accMock = sinon.mock(accountService);
        resMock = sinon.mock(res);
        nextMock = sinon.spy();
    });

    it('checkAccountName Success @UnitTest', mochaAsync(async () => {
        accMock
            .expects('checkAccountName')
            .once()
            .returns(true);

        let accountController = new AccountController(accMock.object);

        resMock
            .expects('sendStatus')
            .withArgs(200)
            .once();

        await accountController.checkAccountName(req, resMock.object, nextMock);

        accMock.verify();
        resMock.verify();

    }));

    it('checkAccountName Failure already used @UnitTest', mochaAsync(async () => {
        accMock
            .expects('checkAccountName')
            .once()
            .throws(new AccountAlreadyInUseException('Name already in use'));

        let accountController = new AccountController(accMock.object);

        resMock
            .expects('sendStatus')
            .never();

        await accountController.checkAccountName(req, resMock, nextMock);

        accMock.verify();
        resMock.verify();

    }));

    it('checkAccountName Failure not valid @UnitTest', mochaAsync(async () => {
        accMock
            .expects('checkAccountName')
            .once()
            .throws(new AccountNameNotValidException('AccountName not valid'));

        let accountController = new AccountController(accMock.object);

        resMock
            .expects('sendStatus')
            .never();

        await accountController.checkAccountName(req, resMock, nextMock);

        accMock.verify();
        resMock.verify();

    }));

    it('checkAccountName Failure Request null @UnitTest', mochaAsync(async () => {

        req = <any>{};

        accMock
            .expects('checkAccountName')
            .never();

        let accountController = new AccountController(accMock.object);

        resMock
            .expects('sendStatus')
            .never();

        await accountController.checkAccountName(req, resMock, nextMock);

        accMock.verify();
        resMock.verify();

        sinon.assert.calledWith(nextMock, new AccountCheckInvalid('Parameters not valid'));

    }));

    it('checkAccountName General Failure @UnitTest', mochaAsync(async () => {
        accMock
            .expects('checkAccountName')
            .once()
            .returns(false);

        let accountController = new AccountController(accMock.object);

        resMock
            .expects('sendStatus')
            .withArgs(200)
            .never();

        await accountController.checkAccountName(req, resMock.object, nextMock);

        accMock.verify();
        resMock.verify();

        sinon.assert.calledWith(nextMock, new AccountCheckInvalid('something went wrong'));

    }));
});

