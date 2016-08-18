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

import CTRL_TAGS from './constant/controller.tags';
import SVC_TAGS from './constant/services.tags';
import REPO_TAGS from './constant/repositories.tags';
import MAPPER_TAGS from './constant/mapper.tags';
import {UserMapper} from './modules/user/mapper/user.mapper';
import {UserAvatarMapper} from './modules/user/mapper/user.avatar.mapper';
import {LogConfig} from './config/log.config';
import {ActionEmailRepository} from './modules/activity/repository/action.email.activity.repository';
import {ActionEmailMapper} from './modules/activity/mapper/action.email.activity.mapper';
import {ActionEmailService} from './modules/activity/services/action.email.activity.service';
import {IUserRepository} from './modules/user/interfaces/user.repository.interface';
import {IActionEmailRepository} from './modules/activity/interfaces/action.email.repository.interface';

const kernel = new Kernel();

// put all your dependencies here
kernel.bind<Controller>(TYPE.Controller)
    .to(UserController)
    .whenTargetNamed(CTRL_TAGS.UserController);

kernel.bind<ILogger>(SVC_TAGS.Logger)
    .to(WinstonLoggerFactory(new LogConfig()));

kernel.bind<LogRepository>(REPO_TAGS.LogRepository)
    .to(LogRepository);

kernel.bind<IUserRepository>(REPO_TAGS.UserRepository)
    .to(UserRepository);

kernel.bind<IActionEmailRepository>(REPO_TAGS.ActionEmailRepository)
    .to(ActionEmailRepository);

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

export default kernel;
