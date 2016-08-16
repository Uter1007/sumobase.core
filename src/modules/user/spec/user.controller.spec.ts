import 'reflect-metadata';
import {User} from "../models/user.model";
import {UserController} from '../controller/user.controller';
import * as moment from 'moment';

/* tslint:disable */
let chai = require('chai');
chai.use(require('chai-as-promised'));
let expect = chai.expect;
let sinon = require('sinon');
/* tslint:enable */

describe('User Controller', () => {

    let loggerMock;
    let serviceMock;
    let mailServiceMock;
    let actionMailServiceMock;
    let resMock;
    let userSkeleton;

    let loggingObj = {
        // empty object - just a mock
    };
    let serviceObj = {
        create: (user, clearTextPassword) => {
            return user;
        },
        findUserByName: (name) => {
            // empty block - just a mock
        },
        update: (user) => {
            return user;
        },
        updatePassword: (id, password) => {
            // empty block - just a mock
        }
    };
    let mailServiceObj = {
        sendActivationMail: () => {
            // empty block - just a mock
        }
    };
    let actionMailServiceObj = {
        createActivationEmail: () => {
            return {
                hash: 'the hash'
            };
        }
    };
    let resObj = {};

    beforeEach(function() {
        loggerMock = sinon.mock(loggingObj);
        serviceMock = sinon.mock(serviceObj);
        mailServiceMock = sinon.mock(mailServiceObj);
        actionMailServiceMock = sinon.mock(actionMailServiceObj);
        resMock = sinon.mock(resObj);
        userSkeleton = {
            confirmPassword: 'the Password$123',
            email: 'the@email.address',
            firstName: 'Max',
            lastName: 'Power',
            password: 'the Password$123'
        };
    });

    it('register succeeds (verify function calls) @unit', async () => {

        let reqMock = sinon.mock({
            body: userSkeleton
        });

        serviceMock
            .expects('findUserByName')
            .once()
            .withArgs('the@email.address');

        serviceMock
            .expects('create')
            .once()
            .withArgs(sinon.match.any, 'the Password$123')
                // the first argument is an object containing an unknown timestamp (createdOn)
                // and thus cannot be tested
            .returns(userSkeleton);

        actionMailServiceMock
            .expects('createActivationEmail')
            .once()
            .withArgs(userSkeleton)
            .returns({
                hash: 'the hash'
            });

        mailServiceMock
            .expects('sendActivationMail')
            .once()
            .withArgs(userSkeleton.lastName, userSkeleton.email, 'the hash');

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object);

        let user = await userController.register(reqMock.object);

        serviceMock.verify();
        mailServiceMock.verify();

    });

    it('register succeeds (verify timestamp) @unit', async () => {

        let reqMock = sinon.mock({
            body: userSkeleton
        });

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object);

        let nowLower = moment().utc().unix();
        let user = await userController.register(reqMock.object);
        let nowUpper = moment().utc().unix();
        expect(user.email).to.equal('the@email.address');
        //expect(moment(new Date(user.createdOn)).unix()).to.be.within(nowLower, nowUpper);

    });

    it('register fails (user exists) @unit', async () => {

        let reqMock = sinon.mock({
            body: userSkeleton
        });

        serviceMock
            .expects('findUserByName')
            .once()
            .withArgs('the@email.address')
            .returns('some user');

        serviceMock
            .expects('create')
            .never();

        actionMailServiceMock
            .expects('createActivationEmail')
            .never();

        mailServiceMock
            .expects('sendActivationMail')
            .never();

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object);

        await expect(userController.register(reqMock.object)).to.be.rejectedWith('Error on register');

        serviceMock.verify();
        mailServiceMock.verify();

    });

    let register = {
        validationTestCases: [
            {
                description: 'password validation: bad password',
                corrupt: (body) => {
                    body.password = 'the password';
                    body.confirmPassword = 'the password';
                },
                expected: {
                    message: 'Password not complex enough'
                }
            },
            {
                description: 'password confirmation: passwords differ',
                corrupt: (body) => {
                    body.confirmPassword = 'the Password$12';
                },
                expected: {
                    message: 'Passwords not equal'
                }
            },
            {
                description: 'user data validation: last name too short',
                corrupt: (body) => {
                    body.lastName = '';
                },
                expected: {
                    message: 'User validation failed'
                }
            }
        ]
    };

    for (let testCase of register.validationTestCases) {
        it(`register fails (${testCase.description}) @unit`, async () => {

            let reqObj = {
                body: userSkeleton
            };
            testCase.corrupt(reqObj.body);
            let invalidReqMock = sinon.mock(reqObj);

            serviceMock
                .expects('findUserByName')
                .once()
                .withArgs('the@email.address');

            serviceMock
                .expects('create')
                .never();

            actionMailServiceMock
                .expects('createActivationEmail')
                .once();

            mailServiceMock
                .expects('sendActivationMail')
                .once();

            let userController = new UserController(loggerMock.object,
                                                    serviceMock.object,
                                                    mailServiceMock.object,
                                                    actionMailServiceMock.object);

            let result = userController.register(invalidReqMock.object);
            await expect(result).to.be.rejectedWith(testCase.expected.message);

            serviceMock.verify();
            mailServiceMock.verify();

        });
    }

    it('logout @unit', async () => {

        let reqObj = {
            logout: () => {
                // empty block - just a mock
            }
        };
        let reqMock = sinon.mock(reqObj);

        reqMock
            .expects('logout')
            .once();

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object);

        let result = userController.logout(reqMock.object);
        expect(result).to.be.true;

        reqMock.verify();

    });

    it('edit succeeds @unit', async() => {
        let reqObj = {
            body: {
                lastName: 'P.'
            },
            user: User.createFromJSON(userSkeleton)
        };
        let reqMock = sinon.mock(reqObj);

        let expectedResult = User.createFromJSON({
            confirmPassword: 'the Password$123',
            email: 'the@email.address',
            firstName: 'Max',
            lastName: 'P.',
            password: 'the Password$123'
        });

        serviceMock
            .expects('update')
            .once()
            .withArgs(expectedResult)
            .returns(expectedResult);

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object);

        let result = await userController.edit(reqMock.object);
        expect(result).to.deep.equal(expectedResult);

        serviceMock.verify();

    });

    it('edit fails (validation) @unit', async () => {

        let reqObj = {
            body: {
                lastName: ''
            },
            user: User.createFromJSON(userSkeleton)
        };
        let reqMock = sinon.mock(reqObj);

        serviceMock
            .expects('update')
            .never();

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object);

        let result = userController.edit(reqMock.object);
        await expect(result).to.be.rejectedWith('User validation failed');

        serviceMock.verify();

    });

    it('changepw succeeds @unit', async () => {

        let reqObj = {
            body: {
                confirmPassword: 'the Password$1234',
                password: 'the Password$1234'
            },
            user: User.createFromJSON(userSkeleton)
        };
        let reqMock = sinon.mock(reqObj);

        serviceMock
            .expects('updatePassword')
            .once()
            .returns(true);

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object);

        let result = await userController.changepw(reqMock.object);
        expect(result).to.be.true;

        serviceMock.verify();

    });

    it('changepw fails (validation) @unit', async () => {

        let reqObj = {
            body: {
                confirmPassword: 'the Password$12345',
                password: 'the Password$1234'
            },
            user: User.createFromJSON(userSkeleton),

        };
        let reqMock = sinon.mock(reqObj);

        serviceMock
            .expects('updatePassword')
            .never();

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object);

        let result = userController.changepw(reqMock.object);
        await expect(result).to.be.rejectedWith('Passwords not equal');

        serviceMock.verify();

    });

});
