import {UserFakeRepository} from '../fakes/user.fake.repository';

import {ILogger, loggerInterfaceName} from '../../../../core/logging/interfaces/logger.interface';
import {WinstonLoggerFactory} from '../../../../core/logging/factory/winston.logger.factory';
import {ActionEmailFakeRepository} from '../../../../core/activity/spec/fakes/action.email.activity.fake.repository';

import {transports} from 'winston';
import kernel from '../../../../../bootstrap';
import {PasswordService} from '../../services/password.service';
import {
    actionEmailRepositoryInterfaceName,
    IActionEmailRepository
} from '../../../../core/activity/models/action.email.activity.db.model';
import {userRepositoryInterfaceName, IUserRepository} from '../../repository/user.repository';

let logconfig = new transports.Console({
    colorize: true,
    handleExceptions: true,
    json: false,
    level: 'debug',
});

// remove Modules you want to Mock or Fake
kernel.unbind(userRepositoryInterfaceName);
kernel.unbind(loggerInterfaceName);
kernel.unbind(actionEmailRepositoryInterfaceName);
kernel.unbind(PasswordService.name);

/* added Fakes & custom Customizations for Tests*/
kernel.bind<IUserRepository>(userRepositoryInterfaceName)
    .to(UserFakeRepository);

kernel.bind<ILogger>(loggerInterfaceName)
    .to(WinstonLoggerFactory(logconfig));

kernel.bind<IActionEmailRepository>(actionEmailRepositoryInterfaceName)
    .to(ActionEmailFakeRepository);

kernel.bind<PasswordService>(PasswordService.name)
    .toConstantValue(new PasswordService(1));

export default kernel;
