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

    it('findUserByNameAsync @unit', async () => {

        let error = new Error('The Error');

        loggerMock
            .expects('error')
            .withArgs('An error occurred:', error)
            .once();

        repoMock
            .expects('findOne')
            .withArgs({'email': 'abc'})
            .once()
            .throws(error);

        let userService = new UserService(loggerMock.object, repoMock.object);

        await userService.findUserByName('abc');

        loggerMock.verify();
        repoMock.verify();

    });

});
