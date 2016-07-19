'use strict';

import {AccountRepository} from '../../../account/logic/accountRepository';
import {AccountService} from '../../../account/logic/accountService';

import {mochaAsync} from '../../../../commons/testing/mocha/asyncAwait';

import {accountModel, AccountState} from '../../../account/models/accountModel';
import {UserService} from '../../../user/logic/userService';
import {userModel, UserRole, UserState} from '../../../user/models/userModel';

let moment = require('moment');
let expect = require('chai').expect;

async function createUser(accountName, userName, password) {
    'use strict';
    let accountRepo = new AccountRepository();
    const newAccount = new accountModel({
        activatedOn: moment(),
        createdOn: moment(),
        name: accountName,
        state: AccountState.ACTIVE,
    });
    let accountRecord = await accountRepo.create(newAccount);
    const userService = new UserService();
    const newUser = new userModel({
        account: accountRecord._id,
        password: password,
        role: UserRole.EMPLOYEE,
        state: UserState.ACTIVE,
        username: userName,
    });
    await userService.createAsync(newUser);
}

async function createDefaultUser() {
    'use strict';
    return await createUser('testerAccount', 'testerUser', 'passwordOfTester');
}

describe('[User Tests] @IntegrationTests', () => {
    it(
      'should detect whether a new user\'s password is hashed, and thus differs from the given one @IntegrationTest',
      mochaAsync(async () => {
          await createDefaultUser();

          let accountService = new AccountService();
          let userService = new UserService();

          let account = await accountService.findAccountByNameAsync('testerAccount');
          let user = await userService.findUserByNameAsync('testerUser', account._id);

          expect(user.password).to.not.equal('passwordOfTester');
          expect(user.password[0]).to.equal('$');
          expect(user.password).to.have.string('$');
        }));
      });
