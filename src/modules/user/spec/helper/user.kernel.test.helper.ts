import {UserFakeRepository} from '../fakes/user.fake.repository';
import {IUserRepository} from '../../interfaces/user.repository.interface';
import REPO_TAGS from '../../../../constants/repositories.tags';
import {ILogger} from '../../../commons/logging/interfaces/logger.interface';
import SVC_TAGS from '../../../../constants/services.tags';
import {WinstonLoggerFactory} from '../../../commons/logging/factory/winston.logger.factory';
import {ActionEmailFakeRepository} from '../../../commons/activity/spec/fakes/action.email.activity.fake.repository';
import {IActionEmailRepository} from '../../../commons/activity/interfaces/action.email.repository.interface';
import {transports} from 'winston';
import kernel from '../../../../bootstrap';
import {PasswordService} from '../../services/password.service';

let logconfig = new transports.Console({
    colorize: true,
    handleExceptions: true,
    json: false,
    level: 'debug',
});

// remove Modules you want to Mock or Fake
kernel.unbind(REPO_TAGS.UserRepository);
kernel.unbind(SVC_TAGS.Logger);
kernel.unbind(REPO_TAGS.ActionEmailRepository);
kernel.unbind(SVC_TAGS.PasswordService);

/* added Fakes & custom Customizations for Tests*/
kernel.bind<IUserRepository>(REPO_TAGS.UserRepository)
    .to(UserFakeRepository);

kernel.bind<ILogger>(SVC_TAGS.Logger)
    .to(WinstonLoggerFactory(logconfig));

kernel.bind<IActionEmailRepository>(REPO_TAGS.ActionEmailRepository)
    .to(ActionEmailFakeRepository);

kernel.bind<PasswordService>(SVC_TAGS.PasswordService)
    .toConstantValue(new PasswordService(1));

export default kernel;
