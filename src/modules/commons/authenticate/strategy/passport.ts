import * as passport from 'passport';
import { Strategy } from 'passport-local';
import kernel from '../../../../bootstrap';
import {UserService} from '../../../user/services/user.service';
import SVC_TAGS from '../../../../constant/services.tags';
import {UserCantLoginException} from '../../error/models/user.cant.login.exception';
import {User} from '../../../user/models/user.model';
import {AuthenticationError} from '../../error/models/authentication.error';

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    let userService = kernel.get<UserService>(SVC_TAGS.UserService);
    let user = await userService.findUserById(id);
    done(null, User.createFromDB(user));
});

passport.use(new Strategy(
    { usernameField: 'email' ,
      passReqToCallback: true
    },
    async function(req, email, password, done) {
        try {
            let userService = kernel.get<UserService>(SVC_TAGS.UserService);
            let user = await userService.findUserByUserNameAndPassword(email, password);
            if (!user) {
                return done(null, false, new UserCantLoginException('Can\'t login User'));
            }
            done(null, User.createFromDB(user));
        } catch ( exception ) {
            return done(new AuthenticationError('Email or Password was wrong'));
        }
    }
));

module.exports = passport;
