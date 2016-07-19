import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import * as configFile from '../../../config/env/config';
import {SessionService} from '../logic/sessionService';
import {sessionModel} from '../models/sessionModel';
import {LogLevel} from '../../../commons/logger/logModel';
import {BaseController} from '../../../commons/base/baseController';
import {IUserModel} from '../../user/models/userModel';
import {SignOptions} from 'jsonwebtoken';
let crypto = require('crypto');

export interface ITokenRequest extends Request {
    token: any;
}

export class AuthController extends BaseController {

    private _sessionService: SessionService;

    constructor(sessionService: SessionService = new SessionService()) {
        super();
        this._sessionService = sessionService;
    }

    public serialize: ((req: ITokenRequest, res: Response, next: Function) => void ) =
        (req: ITokenRequest, res: Response, next: Function) => {
        next();
    };

    public generateRefreshToken: ((req: ITokenRequest, res: Response, next: Function) => void ) =
        async (req: ITokenRequest, res: Response, next: Function) => {
        if (req.body.permanent) {
            let newhash = crypto.randomBytes(40).toString('hex');

            let session = new sessionModel({
                refreshToken: newhash,
                user: req.user.id,
            });

            await this._sessionService.createAsync(session);

            req.token.refreshToken = newhash;
            this.log(LogLevel.INFO, 'Session was created');

            next();

        } else {
            next();
        }
    };

    public validateRefreshToken: ((req: ITokenRequest, res: Response, next: Function) => void ) =
        async (req: ITokenRequest, res: Response, next: Function) => {

        if (req.body && req.body.token && req.body.token.refreshToken && req.body.user && req.body.user.id) {

            let session = await this._sessionService.findSessionAsync(req.body.user.id, req.body.token.refreshToken);

            if (session && session.user) {
                req.user = session.user;
                next();
            } else {
                res.status(404).end();
            }
        } else {
            res.status(401).end();
        }
    };

    public generateAccessToken: ((req: ITokenRequest, res: Response, next: Function) => void ) =
        async (req: ITokenRequest, res: Response, next: Function) => {

        if (req.user && req.user.id) {

            req.token = req.token || {};

            let signOptions: SignOptions = {
                expiresIn: configFile.TestConfig.token.expiresIn,
            };

            req.token.accessToken = jwt.sign(
                {
                    id: req.user.id,
                },
                configFile.TestConfig.token.secret,
                signOptions
            );

            next();
        } else {
            res.status(401).end();
        }
    };

    public rejectToken: ((req: ITokenRequest, res: Response, next: Function) => void ) =
        async (req: ITokenRequest, res: Response, next: Function) => {

        if (req.body && req.body.token && req.body.token.refreshToken && req.body.user && req.body.user.id) {

            let session = await this._sessionService.findSessionAsync(req.body.user.id, req.body.token.refreshToken);

            if (session) {
                await this._sessionService.removeSession(session.id);
                next();
            } else {
                res.status(404).end();
            }
        } else {
            res.status(404).end();
        }
    };

    public respondAuth: ((req: ITokenRequest, res: Response, next: Function) => void ) =
        (req: ITokenRequest, res: Response) => {

        let userret: IUserModel = undefined;

        if (req.user) {
            userret =  <IUserModel>req.user.toObject();
            delete userret.password;
        }

        res.status(200).json({
            token: req.token,
            user: userret,
        });
    };

    public respondToken: ((req: ITokenRequest, res: Response, next: Function) => void ) =
        (req: ITokenRequest, res: Response) => {
        res.status(201).json({
            token: req.token,
        });
    };

    public respondReject: ((req: ITokenRequest, res: Response, next: Function) => void ) =
        (req: ITokenRequest, res: Response) => {
        res.status(204).end();
    };
}
