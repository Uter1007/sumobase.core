import 'reflect-metadata';
import {UserService} from '../services/user.service';

/* tslint:disable */
let sinon = require('sinon');
/* tslint:enable */

describe('User Service', () => {

    let loggerMock;
    let repoMock;

    beforeEach(function() {
        loggerMock = sinon.mock({
            error: function(message, errorObject) {
                // please fill in, also got created TestLogger if you want to use console.log!
            }
        });
        repoMock = sinon.mock({
            findOne: function(data) {
                // please fill in
            }
        });
    });

    it('findUserByNameAsync @unit', async () => {

        loggerMock
            .expects('error')
            .once();
            // .withArgs('An error occurred:', 'TheError');

        repoMock
            .expects('findOne')
            .once()
            .withArgs({'username': 'abc'})
            .throws('TheError');

        let userService = new UserService(loggerMock.object, repoMock.object);

        await userService.findUserByName('abc');

        loggerMock.verify();
        repoMock.verify();

    });

});
