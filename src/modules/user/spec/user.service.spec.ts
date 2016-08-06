import 'reflect-metadata';
import {UserService} from '../services/user.service';
import {IUser} from '../interfaces/user.interface';

/* tslint:disable */
let expect = require('chai').expect;
let sinon = require('sinon');
/* tslint:enable */

describe('User Service', () => {

    let loggerMock;
    let repoMock;
    let mapperMock;
    let pwMock; // password service mock

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
        },
        update: function(id, data) {
            // empty block - just a mock
        }
    };

    let userMapperObj = {
        toDBmodel: function(data) {
            return {password: '123'};
        },
        toUser: function (data){
            return {email: 'the username'};
        }
    };

    let pwObj = {
        hash: function(data, rounds) {
            return Promise.resolve('$2a$12$Fj/BvUyf.9fZuh9JUk.C7eNIDuSmo1GBJpqJidgEgSgCitaGg6CN.');
        },
        compare: function(data, encrypted) {
            return Promise.resolve(true);
        }
    };

    beforeEach(function() {
        loggerMock = sinon.mock(loggingObj);
        repoMock = sinon.mock(repoObj);
        mapperMock = sinon.mock(userMapperObj);
        pwMock = sinon.mock(pwObj);
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

        let userService = new UserService(loggerMock.object, repoMock.object, mapperMock.object, pwMock.object);

        await userService.findUserByUserNameAndPassword('the username', 'the password');

        loggerMock.verify();
        repoMock.verify();

    });

    it('findUserByUserNameAndPassword findOne succeeds @unit', async () => {

        let passwordHash = '$2a$12$Fj/BvUyf.9fZuh9JUk.C7eNIDuSmo1GBJpqJidgEgSgCitaGg6CN.';

        loggerMock
            .expects('error')
            .never();

        repoMock
            .expects('findOne')
            .withArgs({'email': 'the username'})
            .once()
            .returns(Promise.resolve(<any>{
                email: 'the username',
                password: passwordHash
            }));

        let userService = new UserService(loggerMock.object, repoMock.object, mapperMock.object, pwMock.object);

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

        let userService = new UserService(loggerMock.object, repoMock.object, mapperMock.object, pwMock.object);

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
            .returns(Promise.resolve(<any>{
                email: 'the username'
            }));

        let userService = new UserService(loggerMock.object, repoMock.object, mapperMock.object, pwMock.object);

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

        let userService = new UserService(loggerMock.object, repoMock.object, mapperMock.object, pwMock.object);

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
            .returns(Promise.resolve(<any>{
                email: 'the username'
            }));

        let userService = new UserService(loggerMock.object, repoMock.object, mapperMock.object, pwMock.object);

        let user = await userService.findUserById('the user id');
        expect(user.email).to.equal('the username');

        loggerMock.verify();
        repoMock.verify();

    });

    it('create create fails @unit', async() => {

        let userModel = <IUser>{};

        let error = new Error('The Error');

        loggerMock
            .expects('error')
            .withArgs('An error occurred:', error)
            .once();

        repoMock
            .expects('create')
            .once()
            .throws(error);

        let userService = new UserService(loggerMock.object, repoMock.object, mapperMock.object, pwMock.object);

        let result = await userService.create(userModel, 'the password');
        expect(result).to.equal(error);

        loggerMock.verify();
        repoMock.verify();

    });

    it('create create succeeds @unit', async() => {

        let userModel = <IUser>{};

        loggerMock
            .expects('error')
            .never();

        repoMock
            .expects('create')
            .once()
            .returns(Promise.resolve(<any>{
               email: 'the username'
            }));

        let userService = new UserService(loggerMock.object, repoMock.object, mapperMock.object, pwMock.object);

        let user = await userService.create(userModel, 'the password');
        expect(user.email).to.equal('the username');

        loggerMock.verify();
        repoMock.verify();

    });

    it('activateUser update fails @unit', async() => {

        let error = new Error('The Error');

        loggerMock
            .expects('error')
            .withArgs('An error occurred:', error)
            .once();

        repoMock
            .expects('findById')
            .withArgs('the user id')
            .once()
            .returns(Promise.resolve(<any>{
                email: 'the username'
            }));

        repoMock
            .expects('update')
            .once()
            .throws(error);

        let userService = new UserService(loggerMock.object, repoMock.object, mapperMock.object, pwMock.object);

        let result = await userService.activateUser('the user id');
        expect(result).to.equal(error);

        loggerMock.verify();
        repoMock.verify();

    });

    it('activateUser update succeeds @unit', async() => {

        loggerMock
            .expects('error')
            .never();

        repoMock
            .expects('findById')
            .withArgs('the user id')
            .once()
            .returns(Promise.resolve(<any>{
                email: 'the username'
            }));

        repoMock
            .expects('update')
            .once()
            .returns(Promise.resolve(<any>{
                email: 'the username'
            }));

        let userService = new UserService(loggerMock.object, repoMock.object, mapperMock.object, pwMock.object);

        let user = await userService.activateUser('the user id');
        expect(user.email).to.equal('the username');

        loggerMock.verify();
        repoMock.verify();

    });

});
