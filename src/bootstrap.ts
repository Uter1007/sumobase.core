// load everything needed to the kernel

import 'reflect-metadata';
import {LogRepository} from './modules/commons/logging/repository/log.repository';
import {WinstonLoggerFactory} from './modules/commons/logging/factory/winston.logger.factory';
import {ILogger} from './modules/commons/logging/interfaces/logger.interface';
import {Controller} from 'inversify-express-utils';
import {UserController} from './modules/user/controller/user.controller';

import {TYPE} from 'inversify-express-utils';

import { Kernel } from 'inversify';

import CTRL_TAGS from './constant/controller.tags';
import SVC_TAGS from './constant/services.tags';
import REPO_TAGS from './constant/repositories.tags';
import {UserRepository} from './modules/user/repository/user.repository';
import UserService from './modules/user/services/user.service';
import {BaseRepository} from './modules/base/base.repository';

export class Bootstrap {

    public getKernel() {

        let kernel = new Kernel();

        // put all your dependencies here
        kernel.bind<Controller>(TYPE.Controller)
            .to(UserController)
            .whenTargetNamed(CTRL_TAGS.UserController);

        kernel.bind<ILogger>(SVC_TAGS.Logger)
            .to(WinstonLoggerFactory());

        kernel.bind<LogRepository>(REPO_TAGS.LogRepository)
            .to(LogRepository);

        kernel.bind<UserRepository>(REPO_TAGS.UserRepository)
            .to(UserRepository);

        kernel.bind<UserService>(SVC_TAGS.UserService)
            .to(UserService);

        return kernel;
    }
}
