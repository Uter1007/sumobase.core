import 'reflect-metadata';
import UserService from "../user.service";

let sinon = require('sinon');

describe('User Service', () => {

    let loggerMock;
    let repoMock;

    beforeEach(function() {
        loggerMock = sinon.mock({
            error: function(message, errorObject) {

            }
        });
        repoMock = sinon.mock({
            findOne: function(data) {

            }
        });
    });

    it('findUserByNameAsync @unit', async () => {

        loggerMock
            .expects('error')
            .once();
            //.withArgs('An error occurred:', 'TheError');

        repoMock
            .expects('findOne')
            .once()
            .withArgs({'username': 'abc'})
            .throws('TheError');

        let userService = new UserService(loggerMock.object, repoMock.object);

        await userService.findUserByNameAsync('abc');

        loggerMock.verify();
        repoMock.verify();

    });

});
