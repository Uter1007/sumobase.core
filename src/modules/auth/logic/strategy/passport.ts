'use strict';

import * as passport from 'passport';
import { Strategy } from 'passport-local';
import {AccountService} from '../../../account/logic/accountService';
import {UserService} from '../../../user/logic/userService';
import {AuthenticationError} from '../../../errors/models/userMgmtExceptions';

passport.use(new Strategy(
    {passReqToCallback: true},
    async function(req, username, password, done) {

        try {
            let accountName = req.body.accountName;

            if (!accountName || accountName === '') {
                throw new AuthenticationError('Error in Authentication');
            } else {

                let retAcc = await new AccountService().findAccountByNameAsync(accountName);

                if (retAcc) {
                    let retUser = await new UserService()
                        .findUserByUserNameAndPasswordAsync(username, password, retAcc._id);

                    if (retUser) {
                        done(null, retUser);
                    } else {
                        throw new AuthenticationError('Error in Authentication');
                    }
                } else {
                    throw new AuthenticationError('Error in Authentication');
                }
            }
        } catch (error) {
            done(null, error);
        }
    }
));

module.exports = passport;
