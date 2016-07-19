'use strict';

import {AccountRepository} from '../../../account/logic/accountRepository';

import {mochaAsync} from '../../../../commons/testing/mocha/asyncAwait';

import {Response} from 'express';
import {AuthController, ITokenRequest} from '../../controllers/authController';
import {SessionService} from '../../logic/sessionService';

import * as request from 'supertest';
import app from './../../../../app';

import {accountModel, AccountState} from '../../../account/models/accountModel';
import {UserService} from '../../../user/logic/userService';
import {userModel, UserRole, UserState} from '../../../user/models/userModel';

let moment = require('moment');
let sinon = require('sinon');

async function createUser(accountName, userName, password) {
    'use strict';
    let accountRepo = new AccountRepository();
    const newAccount = new accountModel({
        activatedOn: moment(),
        createdOn: moment(),
        name: accountName,
        state: AccountState.ACTIVE,
    });
    let accountRecord = await accountRepo.create(newAccount);
    const userService = new UserService();
    const newUser = new userModel({
        account: accountRecord._id,
        password: password,
        role: UserRole.EMPLOYEE,
        state: UserState.ACTIVE,
        username: userName,
    });
    return await userService.createAsync(newUser);
}
async function createDefaultUser() {
    'use strict';
    return await createUser('testerAccount', 'testerUser', 'passwordOfTester');
}

describe('[Auth Route Tests] @IntegrationTests', () => {

    it('should authenticate a user with valid credentials @IntegrationTest', mochaAsync(async () => {
        await createDefaultUser();
        await request(app)
            .post('/api/auth')
            .type('json')
            .send({
                'username': 'testerUser',
                'password': 'passwordOfTester',
                'accountName': 'testerAccount',
            })
            .expect(200);
    }));

    it('should reject a user with non-existent name but existent password @IntegrationTest', mochaAsync(async () => {
        await createDefaultUser();
        await request(app)
            .post('/api/auth')
            .type('json')
            .send({
                'username': 'inexistentUser',
                'password': 'passwordOfTester',
                'accountName': 'testerAccount',
            })
            .expect(401);
    }));

    it('should reject a user with existent name but non-existent password @IntegrationTest', mochaAsync(async () => {
        await createDefaultUser();
        await request(app)
            .post('/api/auth')
            .type('json')
            .send({
                'username': 'testerUser',
                'password': 'invalidPassword',
                'accountName': 'testerAccount',
            })
            .expect(401);
    }));

    it('should reject a user with both non-existent name and non-existent password @IntegrationTest',
       mochaAsync(async () => {
            await createDefaultUser();
            await request(app)
                .post('/api/auth')
                .type('json')
                .send({
                    'username': 'inexistentUser',
                    'password': 'invalidPassword',
                    'accountName': 'testerAccount',
                })
                .expect(401);
    }));

    it('should be able to access a protected resource after authenticating @IntegrationTest', mochaAsync(async () => {
        await createDefaultUser();
        let response: any = await request(app)
            .post('/api/auth')
            .type('json')
            .send({
                'username': 'testerUser',
                'password': 'passwordOfTester',
                'accountName': 'testerAccount',
            });
        let accessToken = response.body.token.accessToken;
        await request(app)
            .get('/me')
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(200);
    }));

    it('should not be able to access a protected resource after authenticating but using the wrong token ' +
       '@IntegrationTest',
       mochaAsync(async () => {
        await createDefaultUser();
        await request(app)
            .post('/api/auth')
            .type('json')
            .send({
                'username': 'testerUser',
                'password': 'passwordOfTester',
                'accountName': 'testerAccount',
            });
        let accessToken = 'invalidToken';
        await request(app)
            .get('/me')
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(401);
    }));

    it('should not be able to access a protected resource without authentication @IntegrationTest',
       mochaAsync(async () => {
        await request(app)
            .get('/me')
            .expect(401);
    }));

    it('should be able to access a protected resource after authenticating but then rejecting the token ' +
       '@IntegrationTest',
       mochaAsync(async () => {
        let user = await createDefaultUser();
        let response: any = await request(app)
            .post('/api/auth')
            .type('json')
            .send({
                'username': 'testerUser',
                'password': 'passwordOfTester',
                'accountName': 'testerAccount',
                'permanent': true,
            });
        console.log('access token', response.body.token);
        console.log('user id', user);
        await request(app)
            .post('/api/token/reject')
            .type('json')
            .send({
                'token': {
                    'refreshToken': response.body.token.refreshToken,
                },
                'user': {
                    'id': user._id,
                },
            })
            .expect(204);
    }));

});

describe('Auth Controller Tests @UnitTests @auth', () => {
    let sessionService;
    let sessMock;
    let resMock;
    let nextMock;

    let res: Response;
    let req: ITokenRequest;

    beforeEach(function() {
        sessionService = new SessionService();
        res = <any>{

        };
        req = <any>{
            body: {
                permanent: true,
            },
            user: {
                id: 1,
            },
            token: {},
        };

        sessMock = sinon.mock(sessionService);
        resMock = sinon.mock(res);
        nextMock = sinon.spy();
    });

    it('generateRefreshToken @UnitTests @auth', mochaAsync(async () => {
        sessMock
            .expects('createAsync')
            .once()
            .returns();

        let authController = new AuthController(sessMock.object);

        await authController.generateRefreshToken(req, resMock.object, nextMock);

        sessMock.verify();

    }));

});
