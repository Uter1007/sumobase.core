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
            // please fill in, also got created TestLogger if you want to use console.log!
            console.log('was called');
        }
    };

    let repoObj = {
        findOne: function(data) {
            // please fill in
            console.log('was called 2');
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
            .withArgs('An error occured:', error)
            .once();

        repoMock
            .expects('findOne')
            .withArgs({'username': 'abc'})
            .once()
            .throws(error);

        let userService = new UserService(loggerMock.object, repoMock.object);

        await userService.findUserByName('abc');

        loggerMock.verify();
        repoMock.verify();

    });

});
