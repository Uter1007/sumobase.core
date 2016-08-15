import * as express from 'express';

import BaseController from '../../commons/base/base.controller';

import { injectable, inject  } from 'inversify';
import { Controller, Get, Post, Head, Put } from 'inversify-express-utils';
import { ILogger } from '../../commons/logging/interfaces/logger.interface';
import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

import { UserService } from '../services/user.service';

import TYPES from '../../../constant/services.tags';
import {UserAlreadyInUseException} from '../../commons/error/models/user.alreadyinuse.exception';
import {UserValidator} from '../services/validator/user.validator.service';
import {ValidationException} from '../../commons/error/models/validation.exception';
import {PasswordValidator} from '../services/validator/password.validator.service';
import {UserNotFoundException} from '../../commons/error/models/user.notfound.exception';
import * as passport from 'passport';
import storage = require('../../commons/imageupload/middleware/image.storage.middleware');
import {UserAvatarValidator} from '../services/validator/user.avatar.validator.service';
import {UnknownException} from '../../commons/error/models/unknown.exception';
import {MailService} from '../../commons/mail/services/mail.service';
import {ActionEmailService} from '../../activity/services/action.email.activity.service';
import SVC_TAGS from '../../../constant/services.tags';

/* tslint:disable */
let isLoggedIn = require('../../commons/authenticate/middleware/request.authenticater');
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

    constructor(@inject(TYPES.Logger) log: ILogger,
                @inject(TYPES.UserService) userService: UserService,
                @inject(TYPES.MailService) mailService: MailService,
                @inject(SVC_TAGS.ActionEmailService) actionEmailService: ActionEmailService) {
        super();
        this._log = log;
        this._userService = userService;
        this._mailService = mailService;
        this._actionEmailService = actionEmailService;
    }

    /**
     * @api {post} /api/user/register Register User
     * @apiVersion 1.0.0
     * @apiName userRegister
     * @apiGroup User
     *
     * @apiParam {Object} registerRequest Express Body Request
     * @apiParam {String} registerRequest.firstName Firstname of the User
     * @apiParam {String} registerRequest.lastName Lastname of the User
     * @apiParam {String} registerRequest.email Email of the User
     * @apiParam {String} registerRequest.password Password of the User
     * @apiParam {String} registerRequest.confirmPassword Password Confirmation of the User
     *
     * @apiSuccess {Object} registerResponse Express Body Response
     * @apiSuccess {String} registerResponse.id Id of the User.
     * @apiSuccess {String} registerResponse.firstName Firstname of the User.
     * @apiSuccess {String} registerResponse.lastName  Lastname of the User.
     * @apiSuccess {String} registerResponse.email Email of the User.
     * @apiSuccess {String} registerResponse.modifiedOn ModifiedOn Date (UTC specified) of the User.
     * @apiSuccess {String} registerResponse.createdOn CreatedOn Date (UTC specified) of the User.
     *
     * @apiError ValidationException register parameters are not valid
     * @apiError UserAlreadyInUseException user already registered
     */
    @Post('/register')
    public async register(request: express.Request): Promise<User> {
        let user: IUser = User.createFromJSON(request.body);
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
     * @api {post} /api/user/login User Login
     * @apiVersion 1.0.0
     * @apiName userLogin
     * @apiGroup User
     * @apiParam {String} email EMail of the User
     * @apiParam {String} password clearText
     * @apiSuccess Redirect to /api/user/me
     * @apiError Redirect to /api/user/notfound
     */
    @Post('/login', passport.authenticate('local', {
        failureRedirect : '/api/user/notfound',
        successRedirect : '/api/user/me'
    }))

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
     * @apiParam {Object} editRequest Express Body Request
     * @apiParam {String} editRequest.firstName Firstname of the User
     * @apiParam {String} editRequest.lastName Lastname of the User
     *
     * @apiSuccess {Object} editResponse Express Body Response
     * @apiSuccess {String} editResponse.id Id of the User.
     * @apiSuccess {String} editResponse.firstName Firstname of the User.
     * @apiSuccess {String} editResponse.lastName  Lastname of the User.
     * @apiSuccess {String} editResponse.email Email of the User.
     * @apiSuccess {String} editResponse.modifiedOn ModifiedOn Date (UTC specified) of the User.
     * @apiSuccess {String} editResponse.createdOn CreatedOn Date (UTC specified) of the User.
     *
     * @apiError ValidationException register parameters are not valid
     * @apiError UserAlreadyInUseException user already registered
     */
    @Put('/edit', isLoggedIn)
    public async edit(request: express.Request) {
        let user = request.user;

        if (request.body && request.body.firstName) {
            user.firstName = request.body.firstName;
        }

        if (request.body && request.body.lastName) {
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
     * @apiSuccess {Object} userResponse Express Body Response
     * @apiSuccess {String} userResponse.id Id of the User.
     * @apiSuccess {String} userResponse.firstName Firstname of the User.
     * @apiSuccess {String} userResponse.lastName  Lastname of the User.
     * @apiSuccess {String} userResponse.email Email of the User.
     * @apiSuccess {String} userResponse.modifiedOn ModifiedOn Date (UTC specified) of the User.
     * @apiSuccess {String} userResponse.createdOn CreatedOn Date (UTC specified) of the User.
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
     * @apiName uploadAvatar
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
