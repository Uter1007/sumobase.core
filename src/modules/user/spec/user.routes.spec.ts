/* tslint:disable */
import {transports} from 'winston';
let chai = require('chai');
chai.use(require('chai-as-promised'));
let expect = chai.expect;
let sinon = require('sinon');
let request = require('supertest');
let agent = require('superagent');

import 'reflect-metadata';
import * as expressutils from 'inversify-express-utils';
import {UserFakeRepository} from './fakes/user.fake.repository';
import {UserRepository} from '../repository/user.repository';
import {IUserRepository} from '../interfaces/user.repository.interface';
import REPO_TAGS from '../../../constant/repositories.tags';
import {ILogger} from '../../commons/logging/interfaces/logger.interface';
import SVC_TAGS from '../../../constant/services.tags';
import {LogConfig} from '../../../config/log.config';
import {WinstonLoggerFactory} from '../../commons/logging/factory/winston.logger.factory';
import {LogRepository} from '../../commons/logging/repository/log.repository';
import {ActionEmailRepository} from '../../activity/repository/action.email.activity.repository';
import {Controller} from 'inversify-express-utils';
import {UserController} from '../controller/user.controller';
import {TYPE} from 'inversify-express-utils';
import CTRL_TAGS from '../../../constant/controller.tags';
import {PasswordService} from '../services/password.service';
import {ActionEmailService} from '../../activity/services/action.email.activity.service';
import {UserService} from '../services/user.service';
import {MailService} from '../../commons/mail/services/mail.service';
import {UserMapper} from '../mapper/user.mapper';
import {UserAvatarMapper} from '../mapper/user.avatar.mapper';
import {ActionEmailMapper} from '../../activity/mapper/action.email.activity.mapper';
import MAPPER_TAGS from '../../../constant/mapper.tags';
import session = require('express-session');

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as passport from 'passport';
import * as mongoose from 'mongoose';
import * as express from 'express';
import {ActionEmailFakeRepository} from '../../activity/spec/fakes/action.email.activity.fake.repository';
import {IActionEmailRepository} from '../../activity/interfaces/action.email.repository.interface';
import { Kernel } from 'inversify';

/* tslint:enable */


describe('User Route Tests', () => {

    let server: expressutils.interfaces.InversifyExpressServer;
    let kernel: inversify.interfaces.Kernel;
    let logconfig = new transports.Console({
            colorize: true,
            handleExceptions: true,
            json: false,
            level: 'debug',
        });

    beforeEach(function(){

        kernel = new Kernel();

        /* added Fakes & custom Customizations for Tests*/
        kernel.bind<IUserRepository>(REPO_TAGS.UserRepository)
            .to(UserFakeRepository);

        kernel.bind<ILogger>(SVC_TAGS.Logger)
            .to(WinstonLoggerFactory(logconfig));

        kernel.bind<IActionEmailRepository>(REPO_TAGS.ActionEmailRepository)
            .to(ActionEmailFakeRepository);

        /* original Dependencies */
        kernel.bind<Controller>(TYPE.Controller)
            .to(UserController)
            .whenTargetNamed(CTRL_TAGS.UserController);

        kernel.bind<LogRepository>(REPO_TAGS.LogRepository)
            .to(LogRepository);

        kernel.bind<PasswordService>(SVC_TAGS.PasswordService)
            .to(PasswordService);

        kernel.bind<ActionEmailService>(SVC_TAGS.ActionEmailService)
            .to(ActionEmailService);

        kernel.bind<UserService>(SVC_TAGS.UserService)
            .to(UserService);

        kernel.bind<MailService>(SVC_TAGS.MailService)
            .to(MailService);

        kernel.bind<UserMapper>(MAPPER_TAGS.UserMapper)
            .to(UserMapper);

        kernel.bind<UserAvatarMapper>(MAPPER_TAGS.UserAvatarMapper)
            .to(UserAvatarMapper);

        kernel.bind<ActionEmailMapper>(MAPPER_TAGS.ActionEmailMapper)
            .to(ActionEmailMapper);

        kernel.bind<LogConfig>(SVC_TAGS.LogConfig)
            .to(LogConfig);


    });

    afterEach(function(){

    });

    describe('Restricted Routes Not LoggedIn', () => {
        it('/me Route Test', (done) => {

            server = new expressutils.InversifyExpressServer(kernel);

            server.setConfig((app) => {
                app.use(cookieParser());
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({extended: true}));
                app.use(helmet());

                app.use(session({
                    resave: false,
                    saveUninitialized: true,
                    secret: 'testing',
                }));
                app.use(passport.initialize());
                app.use(passport.session()); // persistent login sessions

            });

            server.build();

            done();
        });
    });
});
