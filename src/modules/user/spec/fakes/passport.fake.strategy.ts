import * as passport from 'passport';
import {Strategy} from 'passport-local';
import kernel from '../helper/user.kernel.test.helper';
import {UserService} from '../../services/user.service';
import {UserMapper} from '../../mapper/user.mapper';
import SVC_TAGS from '../../../../constants/services.tags';
import MAPPER_TAGS from '../../../../constants/mapper.tags';
import {UserCantLoginException} from '../../../commons/error/models/user.cant.login.exception';
import {UserState} from '../../models/userstate.model';
import {AuthenticationError} from '../../../commons/error/models/authentication.error';
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
            if (mappedUser.state !== UserState.ACTIVE) {
                return done(null, false, new UserCantLoginException('User has wrong User State'));
            }
            done(null, mappedUser);
        } catch ( exception ) {
            return done(new AuthenticationError('Email or Password was wrong'));
        }
    }
));

module.exports = passport;
