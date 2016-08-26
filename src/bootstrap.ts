// load everything needed to the kernel

import 'reflect-metadata';
import { TYPE } from 'inversify-express-utils';
import { Kernel } from 'inversify';

import { LogRepository } from './modules/core/logging/repository/log.repository';
import { WinstonLoggerFactory } from './modules/core/logging/factory/winston.logger.factory';
import { ILogger } from './modules/core/logging/interfaces/logger.interface';
import { Controller } from 'inversify-express-utils';
import { PasswordService } from './modules/feat/user/services/password.service';
import { UserController } from './modules/feat/user/controller/user.controller';
import { UserRepository } from './modules/feat/user/repository/user.repository';
import { UserService } from './modules/feat/user/services/user.service';
import { MailService } from './modules/core/mail/services/mail.service';

import CTRL_TAGS from './constants/controller.tags';
import SVC_TAGS from './constants/services.tags';
import REPO_TAGS from './constants/repositories.tags';
import MAPPER_TAGS from './constants/mapper.tags';
import {UserMapper} from './modules/feat/user/mapper/user.mapper';
import {UserAvatarMapper} from './modules/feat/user/mapper/user.avatar.mapper';
import {LogConfig} from './config/log.config';
import {ActionEmailRepository} from './modules/core/activity/repository/action.email.activity.repository';
import {ActionEmailMapper} from './modules/core/activity/mapper/action.email.activity.mapper';
import {ActionEmailService} from './modules/core/activity/services/action.email.activity.service';
import {IUserRepository} from './modules/feat/user/interfaces/user.repository.interface';
import {IActionEmailRepository} from './modules/core/activity/interfaces/action.email.repository.interface';
import configLoader from './modules/core/configloader/configloader.service';
import {PassportMiddleware} from './modules/core/authenticate/middleware/passport.middleware';
import MIDDLEWARE_TAGS from './constants/middleware.tags';
import {AuthenticatorMiddleware} from './modules/core/authenticate/middleware/request.authenticater.middleware';

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
