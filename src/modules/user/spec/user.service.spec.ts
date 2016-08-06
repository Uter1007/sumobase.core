import 'reflect-metadata';
import {UserService} from '../services/user.service';
import {IUser} from '../interfaces/user.interface';

/* tslint:disable */
let expect = require('chai').expect;
let sinon = require('sinon');
let bcrypt = require('bcrypt');
/* tslint:enable */

describe('User Service', () => {

    let loggerMock;
    let repoMock;

    let loggingObj = {
        error: function(message, errorObject) {
            // empty block - just a mock
        }
    };

    let repoObj = {
        create: function(data) {
            // empty block - just a mock
        },
        findById: function(id) {
            // empty block - just a mock
        },
        findOne: function(data) {
            // empty block - just a mock
        }
    };

    function hashPassword(pw: string): Promise<any> {
        return new Promise( (resolve: any, reject: any) => {
            bcrypt.hash(pw, 12, function (err, hash) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(hash);
                }
            });
        });
    }

    beforeEach(function() {
        loggerMock = sinon.mock(loggingObj);
        repoMock = sinon.mock(repoObj);
    });

    it('findUserByUserNameAndPassword findOne fails @unit', async () => {

        let error = new Error('The Error');

        loggerMock
            .expects('error')
            .withArgs('An error occurred:', error)
            .once();

        repoMock
            .expects('findOne')
            .withArgs({'email': 'the username'})
            .once()
            .throws(error);

        let userService = new UserService(loggerMock.object, repoMock.object);

        await userService.findUserByUserNameAndPassword('the username', 'the password');

        loggerMock.verify();
        repoMock.verify();

    });

    it('findUserByUserNameAndPassword findOne succeeds @unit', async () => {

        let passwordHash = await hashPassword('the password');

        loggerMock
            .expects('error')
            .never();

        repoMock
            .expects('findOne')
            .withArgs({'email': 'the username'})
            .once()
            .returns({
                email: 'the username',
                password: passwordHash
            });

        let userService = new UserService(loggerMock.object, repoMock.object);

        let user = await userService.findUserByUserNameAndPassword('the username', 'the password');
        expect(user.email).to.equal('the username');

        loggerMock.verify();
        repoMock.verify();

    });

    it('findUserByName findOne fails @unit', async () => {

        let error = new Error('The Error');

        loggerMock
            .expects('error')
            .withArgs('An error occurred:', error)
            .once();

        repoMock
            .expects('findOne')
            .withArgs({'email': 'some@email.address'})
            .once()
            .throws(error);

        let userService = new UserService(loggerMock.object, repoMock.object);

        await userService.findUserByName('some@email.address');

        loggerMock.verify();
        repoMock.verify();

    });

    it('findUserByName findOne succeeds @unit', async () => {

        loggerMock
            .expects('error')
            .never();

        repoMock
            .expects('findOne')
            .withArgs({'email': 'some@email.address'})
            .once()
            .returns({
                email: 'the username'
            });

        let userService = new UserService(loggerMock.object, repoMock.object);

        let user = await userService.findUserByName('some@email.address');
        expect(user.email).to.equal('the username');

        loggerMock.verify();
        repoMock.verify();

    });

    it('findUserById findById fails @unit', async () => {

        let error = new Error('The Error');

        loggerMock
            .expects('error')
            .withArgs('An error occurred:', error)
            .once();

        repoMock
            .expects('findById')
            .withArgs('the user id')
            .once()
            .throws(error);

        let userService = new UserService(loggerMock.object, repoMock.object);

        let result = await userService.findUserById('the user id');
        expect(result).to.equal(error);

        loggerMock.verify();
        repoMock.verify();

    });

    it('findUserById findById succeeds @unit', async () => {

        loggerMock
            .expects('error')
            .never();

        repoMock
            .expects('findById')
            .withArgs('the user id')
            .once()
            .returns({
                email: 'the username'
            });

        let userService = new UserService(loggerMock.object, repoMock.object);

        let user = await userService.findUserById('the user id');
        expect(user.email).to.equal('the username');

        loggerMock.verify();
        repoMock.verify();

    });

    it('create create fails @unit', async() => {

        let userModel = <IUser>{};
        userModel.toDBmodel = sinon.stub().returns({
            password: hashPassword('the password')
        });

        let error = new Error('The Error');

        loggerMock
            .expects('error')
            .withArgs('An error occurred:', error)
            .once();

        repoMock
            .expects('create')
            .once();

        let userService = new UserService(loggerMock.object, repoMock.object);

        // let user =
        await userService.create(userModel, 'the password');

        loggerMock.verify();
        repoMock.verify();

    });

});
