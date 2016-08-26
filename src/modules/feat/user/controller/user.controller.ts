/* tslint:disable */
import * as express from 'express';
import {BaseController} from '../../../core/base/base.controller';
import { injectable, inject  } from 'inversify';
import { Controller, Get, Post, Head, Put } from 'inversify-express-utils';
import { ILogger } from '../../../core/logging/interfaces/logger.interface';
import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import {SVC_TAGS, MAPPER_TAGS} from '../../../../registry/constants.index';
import {UserAlreadyInUseException} from '../../../core/error/models/user.alreadyinuse.exception';
import {UserValidator} from '../services/validator/user.validator.service';
import {ValidationException} from '../../../core/error/models/validation.exception';
import {PasswordValidator} from '../services/validator/password.validator.service';
import {UserNotFoundException} from '../../../core/error/models/user.notfound.exception';
import * as passport from 'passport';
import storage = require('../../../core/imageupload/middleware/image.storage.middleware');
import {UserAvatarValidator} from '../services/validator/user.avatar.validator.service';
import {UnknownException} from '../../../core/error/models/unknown.exception';
import {MailService} from '../../../core/mail/services/mail.service';
import {ActionEmailService} from '../../../core/activity/services/action.email.activity.service';
import {AuthenticatorMiddleware} from '../../../core/authenticate/middleware/request.authenticater.middleware';
import {UserMapper} from '../mapper/user.mapper';
let isLoggedIn = AuthenticatorMiddleware.requestAuthenticater;
let multer = require('multer');
let fs = require('fs');
let path = require('path');
/* tslint:enable */

@injectable()
@Controller('/api/user')
export class UserController extends BaseController {

    private _log: ILogger;
    private _userService: UserService;
    private _mailService: MailService;
    private _actionEmailService: ActionEmailService;
    private _userMapper: UserMapper;

    constructor(@inject(SVC_TAGS.Logger) log: ILogger,
                @inject(SVC_TAGS.UserService) userService: UserService,
                @inject(SVC_TAGS.MailService) mailService: MailService,
                @inject(SVC_TAGS.ActionEmailService) actionEmailService: ActionEmailService,
                @inject(MAPPER_TAGS.UserMapper) userMapper: UserMapper) {
        super();
        this._log = log;
        this._userService = userService;
        this._mailService = mailService;
        this._actionEmailService = actionEmailService;
        this._userMapper = userMapper;
    }

    /**
     * @apiDefine MeObject
     * @apiSuccess {String} id Id of the User.
     * @apiSuccess {String} firstName Firstname of the User.
     * @apiSuccess {String} lastName  Lastname of the User.
     * @apiSuccess {String} email Email of the User.
     * @apiSuccess {String} modifiedOn ModifiedOn Date (UTC specified) of the User.
     * @apiSuccess {String} createdOn CreatedOn Date (UTC specified) of the User.
     */

    /**
     * @api {post} /api/user/register Register User
     * @apiVersion 1.0.0
     * @apiName userRegister
     * @apiGroup User
     *
     * @apiUse MeObject
     *
     * @apiError ValidationException register parameters are not valid
     * @apiError UserAlreadyInUseException user already registered
     */
    @Post('/register')
    public async register(request: express.Request): Promise<User> {
        let user: IUser = this._userMapper.fromJSON(request.body);
        let founduser = await this._userService.findUserByName(user.email);
        if (!founduser) {
            let clearTextPassword: string = request.body.password;
            let clearTextConfirmPassword: string = request.body.confirmPassword;
            if (PasswordValidator.validatePassword(clearTextPassword, clearTextConfirmPassword)) {
                let validateErrors = UserValidator.validateUser(user);
                if (validateErrors.length > 0) {
                    throw new ValidationException('User validation failed');
                }
                let createdUser = await this._userService.create(user, clearTextPassword);
                let activationLink = await this._actionEmailService.createActivationEmail(createdUser);
                await this._mailService.sendActivationMail(createdUser.lastName, createdUser.email, activationLink.hash);
                return createdUser;
            }
        }
        throw new UserAlreadyInUseException('Error on register');
    }

    /**
     * @api {post} /api/user/activate User Activation Link
     * @apiVersion 1.0.0
     * @apiName userActivate
     * @apiGroup User
     * @apiParam {String} hash ActivationLinkId
     * @apiSuccess {Boolean} true if update was successful
     * @apiError ActivationNotValid
     */
    @Post('/activate')
    public async activate(request: express.Request): Promise<Boolean> {
        let hash = request.body.hash;
        return await this._actionEmailService.updateActivationEmail(hash);
    }

    /**
     * @api {post} /api/user/login User Login
     * @apiVersion 1.0.0
     * @apiName userLogin
     * @apiGroup User
     * @apiParam {String} email EMail of the User
     * @apiParam {String} password clearText
     * @apiUse MeObject
     * @apiError 401
     */
    @Post('/login', passport.authenticate('local'))
    public login(request: express.Request, response: express.Response, next) {
        request.logIn(request.user, function() {
            response.send(request.user);
        });

    }

    /**
     * @api {get} /api/user/logout User Logout
     * @apiVersion 1.0.0
     * @apiName userLogout
     * @apiGroup User
     *
     * @apiSuccess {Boolean} Success
     */
    @Get('/logout', isLoggedIn)
    public logout(request: express.Request) {
        request.logout();
        return true;
    }

    /**
     * @api {put} /api/user/edit Edit User
     * @apiVersion 1.0.0
     * @apiName userEdit
     * @apiGroup User
     *
     * @apiUse MeObject
     *
     * @apiError ValidationException register parameters are not valid
     * @apiError UserAlreadyInUseException user already registered
     */
    @Put('/edit', isLoggedIn)
    public async edit(request: express.Request) {
        let user: IUser = this._userMapper.fromJSON(request.user);

        if (request.body && typeof request.body.firstName === 'string') {
            user.firstName = request.body.firstName;
        }

        if (request.body && typeof request.body.lastName === 'string') {
            user.lastName = request.body.lastName;
        }

        let validateErrors = UserValidator.validateUser(user);
        if (validateErrors.length > 0) {
            throw new ValidationException('User validation failed');
        }

        let updateduser = await this._userService.update(user);
        return updateduser;
    }

    /**
     * @api {put} /api/user/changepw Change Password
     * @apiVersion 1.0.0
     * @apiName changePassword
     * @apiGroup User
     *
     * @apiParam {Object} changePasswordRequest Express Body Request
     * @apiParam {String} changePasswordRequest.firstName Firstname of the User
     * @apiParam {String} changePasswordRequest.lastName Lastname of the User
     *
     * @apiSuccess {Boolean} change Pw was ok
     *
     * @apiError ValidationException parameters are not valid
     * @apiError UnkownException change Password failed
     */
    @Put('/changepw', isLoggedIn)
    public async changepw(request: express.Request) {
        let user = request.user;
        let clearTextPassword: string = request.body.password;
        let clearTextConfirmPassword: string = request.body.confirmPassword;
        if (PasswordValidator.validatePassword(clearTextPassword, clearTextConfirmPassword)) {
            return await this._userService.updatePassword(user.id, clearTextPassword);
        }
    }

    /**
     * @api {head} /api/user/check Check if Email is already in use
     * @apiVersion 1.0.0
     * @apiName checkUserName
     * @apiGroup User
     *
     * @apiSuccess (200)  UserName doesn't exist
     * @apiSuccess (404)  UserName already in use
     */
    @Head('/check')
    public async checkUserName(request: express.Request, response: express.Response, next) {
        let founduser = await this._userService.findUserByName(request.header('email'));
        if (founduser) {
            response.status(404);
        } else {
            response.status(200);
        }

        next();

    }

    /**
     * @api {get} /api/user/me User Information
     * @apiVersion 1.0.0
     * @apiName userMe
     * @apiGroup User
     *
     * @apiUse MeObject
     *
     * @apiError ValidationException register parameters are not valid
     * @apiError UserAlreadyInUseException user already registered
     */
    @Get('/me', isLoggedIn)
    public async me(request: express.Request): Promise<string> {
        return request.user;
    }

    /**
     * @api {post} /api/user/avatar Upload Avatar Picture
     * @apiVersion 1.0.0
     * @apiName uploadAvatar
     * @apiGroup User
     *
     * @apiParam {Object} uploadPicutre Express Body Form-Data
     * @apiParam {String} avatar File, size <= 512kb, dimension (width, height) <= 512px, Filetypes: gif/png/jpeg
     *
     * @apiSuccess {Boolean} true if Upload was successful
     * @apiError PhotoValidationException Validation failed
     * @apiError UserAlreadyInUseException Request not valid
     */
    @Post('/avatar', isLoggedIn, multer({ limits: { fileSize: 512000 }, storage: storage}).single('avatar'))
    public async uploadAvatar(request: express.Request): Promise<boolean> {

        if (request.file && UserAvatarValidator.validateImage(request.file)) {
            let filecontent = fs.readFileSync(request.file.path);
            return await this._userService.updateImage(request.user.id,
                new Buffer(filecontent),
                request.file.mimetype
            );
        } else {
            throw new UnknownException('Request not valid');
        }
    }

    /**
     * @api {get} /api/user/avatar Retrieve Avatar Picture
     * @apiVersion 1.0.0
     * @apiName getAvatar
     * @apiGroup User
     *
     * @apiSuccess {Object} Avatar Picture File
     */
    @Get('/avatar', isLoggedIn)
    public async retrieveAvatar(request: express.Request, response: express.Response) {
        let userid = request.query.userid || request.user.id;
        if (userid) {
             let userAvatar = await this._userService.retrieveImage(userid);
             if (userAvatar) {
                 response.contentType(userAvatar.contentType);
                 response.send(userAvatar.data);
             } else {
                 const filename =  path.join(process.cwd(), '/dist/public/images/sumohead.small.png');
                 let filecontent = fs.readFileSync(filename);
                 response.contentType('image/png');
                 response.send(filecontent);
             }
        } else {
            throw new UnknownException('No User was found');
        }
    }

    // routes that may not be needed
    @Get('/notfound')
    public notfound() {
        throw new UserNotFoundException('user can\'t be found');
    }
}
