let expect = require('chai').expect;
import {mochaAsync} from '../../../../commons/testing/mocha/asyncAwait';

import {accountModel, AccountState} from '../../models/accountModel';
import {AccountService} from '../../logic/accountService';
import {AccountRepository} from '../../logic/accountRepository';
let moment = require('moment');

describe('Account Service Tests @IntegrationTests', () => {

    it('should create an account @IntegrationTest', mochaAsync(async () => {
        let accountService = new AccountService();

        let now = moment();

        let accountName = 'tester2';
        const newAccount = new accountModel({
            activatedOn: now,
            createdOn: now,
            name: accountName,
            state: AccountState.PENDING,
        });

        accountService.createAsync(newAccount);

        let repo = new AccountRepository();
        let result = await repo.find({ name: 'tester2' });
        expect(result.length).to.equal(1);
        result.forEach(function(element) {
            expect(now.diff(element.activatedOn)).to.equal(0);
            expect(now.diff(element.createdOn)).to.equal(0);
            expect(element.name).to.equal('tester2');
            expect(element.state).to.equal(AccountState.PENDING);
        });

    }));

});
