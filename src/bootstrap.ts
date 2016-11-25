// load everything needed to the kernel

import 'reflect-metadata';
import { TYPE, interfaces, Controller, } from 'inversify-express-utils';
import { Kernel } from 'inversify';

import { LogRepository } from './modules/core/logging/repository/log.repository';
import { WinstonLoggerFactory } from './modules/core/logging/factory/winston.logger.factory';
import { ILogger,
         loggerInterfaceName } from './modules/core/logging/interfaces/logger.interface';
import { PasswordService } from './modules/feat/user/services/password.service';
import { UserController } from './modules/feat/user/controller/user.controller';
import {
    UserRepository, IUserRepository,
    userRepositoryInterfaceName
} from './modules/feat/user/repository/user.repository';
import { UserService } from './modules/feat/user/services/user.service';
import { MailService } from './modules/core/mail/services/mail.service';

import {UserMapper} from './modules/feat/user/mapper/user.mapper';
import {UserAvatarMapper} from './modules/feat/user/mapper/user.avatar.mapper';
import {LogConfig} from './config/log.config';
import {ActionEmailRepository} from './modules/core/activity/repository/action.email.activity.repository';
import {ActionEmailMapper} from './modules/core/activity/mapper/action.email.activity.mapper';
import {ActionEmailService} from './modules/core/activity/services/action.email.activity.service';

import {ConfigLoader} from './modules/core/configloader/configloader.service';
import {PassportMiddleware} from './modules/core/authenticate/middleware/passport.middleware';
import {AuthenticatorMiddleware} from './modules/core/authenticate/middleware/request.authenticater.middleware';
import {
    IActionEmailRepository,
    actionEmailRepositoryInterfaceName
} from './modules/core/activity/models/action.email.activity.db.model';

const config = ConfigLoader.getConfig();
const kernel = new Kernel();

// put all your dependencies here

/* Middlewares */
kernel.bind<PassportMiddleware>(PassportMiddleware.name)
    .to(PassportMiddleware);

kernel.bind<AuthenticatorMiddleware>(AuthenticatorMiddleware.name)
    .to(AuthenticatorMiddleware);

/* Repositories */
kernel.bind<LogRepository>(LogRepository.name)
    .to(LogRepository);

kernel.bind<IUserRepository>(userRepositoryInterfaceName)
    .to(UserRepository);

kernel.bind<IActionEmailRepository>(actionEmailRepositoryInterfaceName)
    .to(ActionEmailRepository);

/* Services */
kernel.bind<LogConfig>(LogConfig.name)
    .to(LogConfig);

kernel.bind<ILogger>(loggerInterfaceName)
    .to(WinstonLoggerFactory(new LogConfig()));

kernel.bind<PasswordService>(PasswordService.name)
    .toConstantValue(new PasswordService(config.passwordHandler.saltingRounds));

kernel.bind<ActionEmailService>(ActionEmailService.name)
    .to(ActionEmailService);

kernel.bind<UserService>(UserService.name)
    .to(UserService);

kernel.bind<MailService>(MailService.name)
    .to(MailService);

/* Mappers */
kernel.bind<UserMapper>(UserMapper.name)
    .to(UserMapper).inSingletonScope();

kernel.bind<UserAvatarMapper>(UserAvatarMapper.name)
    .to(UserAvatarMapper).inSingletonScope();

kernel.bind<ActionEmailMapper>(ActionEmailMapper.name)
    .to(ActionEmailMapper).inSingletonScope();

/* Controllers */
kernel.bind<interfaces.Controller>(TYPE.Controller)
    .to(UserController)
    .whenTargetNamed(UserController.name);

export default kernel;
