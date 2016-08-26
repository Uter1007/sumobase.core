import 'reflect-metadata';
import {UserService} from '../services/user.service';
import {IUser} from '../interfaces/user.interface';
import {UnknownException} from '../../../core/error/models/unknown.exception';

/* tslint:disable */
let expect = require('chai').expect;
let sinon = require('sinon');
/* tslint:enable */

describe('User Service', () => {

    let loggerMock;
    let repoMock;
    let mapperMock;
    let pwMock; // password service mock
    let userAvatarMock;

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
        compare: function(data, encrypted) {
            return Promise.resolve(true);
        },
        hash: function(data, rounds) {
            return Promise.resolve('$2a$12$Fj/BvUyf.9fZuh9JUk.C7eNIDuSmo1GBJpqJidgEgSgCitaGg6CN.');
        }
    };

    let userAvatarObj = {
        toUserAvatar: function(data) {
            return { contentType: 'image', data: new Buffer('', 'base64') };
        }
    };

    beforeEach(function() {
        loggerMock = sinon.mock(loggingObj);
        repoMock = sinon.mock(repoObj);
        mapperMock = sinon.mock(userMapperObj);
        pwMock = sinon.mock(pwObj);
        userAvatarMock = sinon.mock(userAvatarObj);
    });

    afterEach(function() {
        loggerMock.restore();
        repoMock.restore();
        mapperMock.restore();
        pwMock.restore();
        userAvatarMock.restore();
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

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);

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

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);

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

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);

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

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);


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

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);


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

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);


        let user = await userService.findUserById('the user id');
        expect(user.email).to.equal('the username');

        loggerMock.verify();
        repoMock.verify();

    });

    it('create create fails @unit', async () => {

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

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);


        let result = await userService.create(userModel, 'the password');
        expect(result).to.equal(error);

        loggerMock.verify();
        repoMock.verify();

    });

    it('create create succeeds @unit', async () => {

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

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);


        let user = await userService.create(userModel, 'the password');
        expect(user.email).to.equal('the username');

        loggerMock.verify();
        repoMock.verify();

    });

    it('activateUser update fails @unit', async () => {

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

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);


        let result = await userService.activateUser('the user id');
        expect(result).to.equal(error);

        loggerMock.verify();
        repoMock.verify();

    });

    it('activateUser update succeeds @unit', async () => {

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
            .returns(Promise.resolve(true))
            .once();

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);


        let user = await userService.activateUser('the user id');
        expect(user).to.be.true;

        loggerMock.verify();
        repoMock.verify();

    });

    it('update User succeeds @unit', async () => {

        loggerMock
            .expects('error')
            .never();

        repoMock
            .expects('findById')
            .once()
            .withArgs('the id')
            .returns(Promise.resolve({
                id: 'the id'
            }));

        repoMock
            .expects('update')
            .once()
            .withArgs('the id', {
                firstName: 'Max',
                id: 'the id',
                lastName: 'Power'
            })
            .returns(Promise.resolve(true));

        mapperMock
            .expects('toUser')
            .once()
            .withArgs({
                firstName: 'Max', // stems from UserService.update
                id: 'the id',
                lastName: 'Power' // stems from UserService.update
            });

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);
        let user = <IUser>{};
        user.id = 'the id';
        user.firstName = 'Max';
        user.lastName = 'Power';

        await userService.update(user);

        loggerMock.verify();
        repoMock.verify();
        mapperMock.verify();

    });

    it('update User fails @unit', async () => {

        loggerMock
            .expects('error')
            .once()
            .withArgs(
                'An error occurred:',
                new UnknownException('User can not be updated'));

        repoMock
            .expects('findById')
            .once()
            .withArgs('the id')
            .returns(Promise.resolve({
                id: 'the id'
            }));

        repoMock
            .expects('update')
            .once()
            .withArgs('the id', {
                firstName: 'Max',
                id: 'the id',
                lastName: 'Power'
            })
            .returns(Promise.resolve(false));

        mapperMock
            .expects('toUser')
            .never();

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);
        let user = <IUser>{};
        user.id = 'the id';
        user.firstName = 'Max';
        user.lastName = 'Power';

        await userService.update(user);

        loggerMock.verify();
        repoMock.verify();
        mapperMock.verify();

    });

    it('update User password succeeds @unit', async () => {

        loggerMock
            .expects('error')
            .never();

        repoMock
            .expects('findById')
            .once()
            .withArgs('the id')
            .returns(Promise.resolve({
                id: 'the id'
            }));

        pwMock
            .expects('hash')
            .once()
            .withArgs('the password')
            .returns('the password\'s hash');

        repoMock
            .expects('update')
            .once()
            .withArgs('the id', {
                id: 'the id',
                password: 'the password\'s hash'
            })
            .returns(Promise.resolve(true));

        let userService = new UserService(loggerMock.object,
                                          repoMock.object,
                                          mapperMock.object,
                                          pwMock.object,
                                          userAvatarMock.object);

        await userService.updatePassword('the id', 'the password');

        loggerMock.verify();
        repoMock.verify();
        pwMock.verify();

    });

    it('update User password fails @unit', async () => {

        loggerMock
            .expects('error')
            .once()
            .withArgs(
                'An error occurred:',
                new UnknownException('User can not be updated'));

        repoMock
            .expects('findById')
            .once()
            .withArgs('the id')
            .returns(Promise.resolve({
                id: 'the id'
            }));

        pwMock
            .expects('hash')
            .once()
            .withArgs('the password')
            .returns('the password\'s hash');

        repoMock
            .expects('update')
            .once()
            .withArgs('the id', {
                id: 'the id',
                password: 'the password\'s hash'
            })
            .returns(Promise.resolve(false));

        let userService = new UserService(loggerMock.object,
            repoMock.object,
            mapperMock.object,
            pwMock.object,
            userAvatarMock.object);

        await userService.updatePassword('the id', 'the password');

        loggerMock.verify();
        repoMock.verify();
        pwMock.verify();

    });

});
