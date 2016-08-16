import * as passport from 'passport';
import { Strategy } from 'passport-local';
import kernel from '../../../../bootstrap';
import {UserService} from '../../../user/services/user.service';
import SVC_TAGS from '../../../../constant/services.tags';
import {UserCantLoginException} from '../../error/models/user.cant.login.exception';
import {AuthenticationError} from '../../error/models/authentication.error';
import {UserMapper} from '../../../user/mapper/user.mapper';
import MAPPER_TAGS from '../../../../constant/mapper.tags';
import {UserState} from '../../../user/models/userstate.model';

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    let userService = kernel.get<UserService>(SVC_TAGS.UserService);
    let userMapper = kernel.get<UserMapper>(MAPPER_TAGS.UserMapper);
    let user = await userService.findUserById(id);
    done(null, userMapper.toUser(user));
});

passport.use(new Strategy(
    {
        passReqToCallback: true,
        usernameField: 'email'
    },
    async function(req, email, password, done) {
        try {
            let userService = kernel.get<UserService>(SVC_TAGS.UserService);
            let userMapper = kernel.get<UserMapper>(MAPPER_TAGS.UserMapper);
            let user = await userService.findUserByUserNameAndPassword(email, password);
            if (!user) {
                return done(null, false, new UserCantLoginException('Can\'t login User'));
            }
            let mappedUser = userMapper.toUser(user);
            if (mappedUser.state === UserState.ACTIVE) {
                return done(null, false, new UserCantLoginException('User has wrong User State'));
            }
            done(null, mappedUser);
        } catch ( exception ) {
            return done(new AuthenticationError('Email or Password was wrong'));
        }
    }
));

module.exports = passport;
