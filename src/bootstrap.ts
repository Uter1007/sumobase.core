// load everything needed to the kernel

import 'reflect-metadata';
import {LogRepository} from './modules/logging/repository/log.repository';
import {WinstonLoggerFactory} from './modules/logging/factory/winston.logger.factory';
import {ILogger} from './modules/logging/interfaces/logger.interface';
import {Controller} from 'inversify-express-utils';
import {UserController} from './modules/user/controller/user.controller';

import {TYPE} from 'inversify-express-utils';

import { Kernel } from 'inversify';

import CTRL_TAGS from './constant/controller.tags';
import SVC_TAGS from './constant/services.tags';
import REPO_TAGS from './constant/repositories.tags';

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

        return kernel;
    }
}
