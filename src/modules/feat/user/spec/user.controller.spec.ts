import 'reflect-metadata';

import {UserController} from '../controller/user.controller';
import {UserMapper} from '../mapper/user.mapper';

/* tslint:disable */
import chai = require('chai');
import chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
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
    let userMapper: UserMapper;

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
    let resObj = {
        send: (num, str) => {
            // empty block - just a mock
        },
        status: (code) => {
            // empty block - just a mock
        }
    };

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
        userMapper = new UserMapper();
    });

    afterEach(function() {
        loggerMock.restore();
        serviceMock.restore();
        mailServiceMock.restore();
        actionMailServiceMock.restore();
        resMock.restore();
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
                                                actionMailServiceMock.object,
                                                userMapper);

        await userController.register(reqMock.object);

        serviceMock.verify();
        mailServiceMock.verify();

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
                                                actionMailServiceMock.object,
                                                userMapper);

        await expect(userController.register(reqMock.object)).to.be.rejectedWith('Error on register');

        serviceMock.verify();
        mailServiceMock.verify();

    });

    let register = {
        validationTestCases: [
            {
                corrupt: (body) => {
                    body.password = 'the password';
                    body.confirmPassword = 'the password';
                },
                description: 'password validation: bad password',
                expected: {
                    message: 'Password not complex enough'
                }
            },
            {
                corrupt: (body) => {
                    body.confirmPassword = 'the Password$12';
                },
                description: 'password confirmation: passwords differ',
                expected: {
                    message: 'Passwords not equal'
                }
            },
            {
                corrupt: (body) => {
                    body.lastName = '';
                },
                description: 'user data validation: last name too short',
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
                .never();

            mailServiceMock
                .expects('sendActivationMail')
                .never();

            let userController = new UserController(loggerMock.object,
                                                    serviceMock.object,
                                                    mailServiceMock.object,
                                                    actionMailServiceMock.object,
                                                    userMapper);

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
                                                actionMailServiceMock.object,
                                                userMapper);

        let result = userController.logout(reqMock.object);
        expect(result).to.be.true;

        reqMock.verify();

    });

    it('edit succeeds @unit', async() => {
        let reqObj = {
            body: {
                lastName: 'P.'
            },
            user: userSkeleton
        };
        let reqMock = sinon.mock(reqObj);

        let expectedResult = userMapper.fromJSON({
            createdOn: undefined,
            email: 'the@email.address',
            firstName: 'Max',
            id: undefined,
            lastName: 'P.',
            modifiedOn: undefined,
            state: 'pending'
        });

        serviceMock
            .expects('update')
            .once()
            .withArgs(expectedResult)
            .returns(expectedResult);

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object,
                                                userMapper);

        let result = await userController.edit(reqMock.object);
        expect(result).to.deep.equal(expectedResult);

        serviceMock.verify();

    });

    it('edit fails (validation) @unit', async () => {

        let reqObj = {
            body: {
                lastName: ''
            },
            user: userSkeleton
        };
        let reqMock = sinon.mock(reqObj);

        serviceMock
            .expects('update')
            .never();

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object,
                                                userMapper);

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
            user: userSkeleton
        };
        let reqMock = sinon.mock(reqObj);

        serviceMock
            .expects('updatePassword')
            .once()
            .returns(true);

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object,
                                                userMapper);

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
            user: userMapper.fromJSON(userSkeleton),

        };
        let reqMock = sinon.mock(reqObj);

        serviceMock
            .expects('updatePassword')
            .never();

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object,
                                                userMapper);

        let result = userController.changepw(reqMock.object);
        await expect(result).to.be.rejectedWith('Passwords not equal');

        serviceMock.verify();

    });

    it('checkUserName success @unit', async () => {

        let reqObj = {
            header: () => {
                return 'the@email.address';
            }
        };
        let reqMock = sinon.mock(reqObj);

        serviceMock
            .expects('findUserByName')
            .once()
            .returns(Promise.resolve(null));

        resMock
            .expects('send')
            .once()
            .withArgs(200, 'free to go');

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object,
                                                userMapper);

        await userController.checkUserName(reqMock.object, resMock.object);

        serviceMock.verify();
        reqMock.verify();
        resMock.verify();

    });

    it('checkUserName user name exists @unit', async () => {

        let reqObj = {
            header: () => {
                return 'the@email.address';
            }
        };
        let reqMock = sinon.mock(reqObj);

        serviceMock
            .expects('findUserByName')
            .once()
            .returns(Promise.resolve('some other user'));

        resMock
            .expects('send')
            .once()
            .withArgs(404, 'Already in Use');

        let userController = new UserController(loggerMock.object,
                                                serviceMock.object,
                                                mailServiceMock.object,
                                                actionMailServiceMock.object,
                                                userMapper);

        await userController.checkUserName(reqMock.object, resMock.object);

        serviceMock.verify();
        reqMock.verify();
        resMock.verify();

    });
});
