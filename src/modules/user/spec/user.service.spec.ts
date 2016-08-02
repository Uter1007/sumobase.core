import 'reflect-metadata';
import {UserService} from '../services/user.service';

/* tslint:disable */
let sinon = require('sinon');
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
        findOne: function(data) {
            // empty block - just a mock
        }
    };

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
            .once();

        let userService = new UserService(loggerMock.object, repoMock.object);

        await userService.findUserByName('some@email.address');

        loggerMock.verify();
        repoMock.verify();


    })

});
