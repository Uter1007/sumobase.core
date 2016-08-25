// load everything needed to the kernel

import 'reflect-metadata';
import { TYPE } from 'inversify-express-utils';
import { Kernel } from 'inversify';

import { LogRepository } from './modules/commons/logging/repository/log.repository';
import { WinstonLoggerFactory } from './modules/commons/logging/factory/winston.logger.factory';
import { ILogger } from './modules/commons/logging/interfaces/logger.interface';
import { Controller } from 'inversify-express-utils';
import { PasswordService } from './modules/user/services/password.service';
import { UserController } from './modules/user/controller/user.controller';
import { UserRepository } from './modules/user/repository/user.repository';
import { UserService } from './modules/user/services/user.service';
import { MailService } from './modules/commons/mail/services/mail.service';

import CTRL_TAGS from './constants/controller.tags';
import SVC_TAGS from './constants/services.tags';
import REPO_TAGS from './constants/repositories.tags';
import MAPPER_TAGS from './constants/mapper.tags';
import {UserMapper} from './modules/user/mapper/user.mapper';
import {UserAvatarMapper} from './modules/user/mapper/user.avatar.mapper';
import {LogConfig} from './config/log.config';
import {ActionEmailRepository} from './modules/commons/activity/repository/action.email.activity.repository';
import {ActionEmailMapper} from './modules/commons/activity/mapper/action.email.activity.mapper';
import {ActionEmailService} from './modules/commons/activity/services/action.email.activity.service';
import {IUserRepository} from './modules/user/interfaces/user.repository.interface';
import {IActionEmailRepository} from './modules/commons/activity/interfaces/action.email.repository.interface';
import configLoader from './modules/commons/configloader/configloader.service';
import {PassportMiddleware} from './modules/commons/authenticate/middleware/passport.middleware';
import MIDDLEWARE_TAGS from './constants/middleware.tags';
import {AuthenticatorMiddleware} from './modules/commons/authenticate/middleware/request.authenticater.middleware';

const config = configLoader.getConfig();
const kernel = new Kernel();

// put all your dependencies here

/* Middlewares */
kernel.bind<PassportMiddleware>(MIDDLEWARE_TAGS.PassportMiddleware)
    .to(PassportMiddleware);

kernel.bind<AuthenticatorMiddleware>(MIDDLEWARE_TAGS.AuthenticatorMiddleware)
    .to(AuthenticatorMiddleware);

/* Repositories */
kernel.bind<LogRepository>(REPO_TAGS.LogRepository)
    .to(LogRepository);

kernel.bind<IUserRepository>(REPO_TAGS.UserRepository)
    .to(UserRepository);

kernel.bind<IActionEmailRepository>(REPO_TAGS.ActionEmailRepository)
    .to(ActionEmailRepository);

/* Services */
kernel.bind<LogConfig>(SVC_TAGS.LogConfig)
    .to(LogConfig);

kernel.bind<ILogger>(SVC_TAGS.Logger)
    .to(WinstonLoggerFactory(new LogConfig()));

kernel.bind<PasswordService>(SVC_TAGS.PasswordService)
    .toConstantValue(new PasswordService(config.passwordHandler.saltingRounds));

kernel.bind<ActionEmailService>(SVC_TAGS.ActionEmailService)
    .to(ActionEmailService);

kernel.bind<UserService>(SVC_TAGS.UserService)
    .to(UserService);

kernel.bind<MailService>(SVC_TAGS.MailService)
    .to(MailService);

/* Mappers */
kernel.bind<UserMapper>(MAPPER_TAGS.UserMapper)
    .to(UserMapper).inSingletonScope();

kernel.bind<UserAvatarMapper>(MAPPER_TAGS.UserAvatarMapper)
    .to(UserAvatarMapper).inSingletonScope();

kernel.bind<ActionEmailMapper>(MAPPER_TAGS.ActionEmailMapper)
    .to(ActionEmailMapper).inSingletonScope();

/* Controllers */
kernel.bind<Controller>(TYPE.Controller)
    .to(UserController)
    .whenTargetNamed(CTRL_TAGS.UserController);

export default kernel;
