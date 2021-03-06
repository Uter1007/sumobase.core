import {UserService} from '../../../feat/user/services/user.service';
import {UserCantLoginException} from '../../error/models/user.cant.login.exception';
import {AuthenticationError} from '../../error/models/authentication.error';
import {UserMapper} from '../../../feat/user/mapper/user.mapper';
import {UserState} from '../../../feat/user/models/userstate.model';

import {injectable, inject} from 'inversify';
import {IUser} from '../../../feat/user/models/user.model';

@injectable()
export class PassportMiddleware {

    private _userService: UserService;
    private _userMapper: UserMapper;

    constructor(@inject(UserService.name) userService: UserService,
                @inject(UserMapper.name) userMapper: UserMapper) {

        this._userService = userService;
        this._userMapper = userMapper;
    }

    public serializeUser = (user: IUser, done) => {
        done(null, user.id);
    };

    public deserializeUser = async (id: string, done) => {
        let user = await this._userService.findUserById(id);
        done(null, user);
    };

    public localStrategy = async (req, email, password, done) => {
        try {
            let user = await this._userService.findUserByUserNameAndPassword(email, password);
            if (!user) {
                return done(null, false, new UserCantLoginException('Can\'t login User'));
            }
            if (user.state !== UserState.ACTIVE) {
                return done(null, false, new UserCantLoginException('User has wrong User State'));
            }
            done(null, user);
        } catch ( exception ) {
            return done(new AuthenticationError('Email or Password was wrong'));
        }
    };
}

