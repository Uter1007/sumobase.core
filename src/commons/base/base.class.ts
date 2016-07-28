'use strict';

import {logger} from '../logger/logger';
import {LogLevel} from '../logger/log.model';

abstract class BaseClass {
    protected log(level: LogLevel, message: string) {
        return logger.log(level, message);
    }
}

export {BaseClass};
