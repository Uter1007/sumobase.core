import {ILogOptions} from '../modules/commons/logging/models/logmodel.db.model';
import {LogLevel} from '../modules/commons/logging/models/loglevel.model';
import {LoggerOptions} from 'winston';
import {transports} from 'winston';
import MongooseTransport from '../modules/commons/logging/transport/winston.mongoose.transport';
import { injectable } from 'inversify';
import * as winston from 'winston';
import {TransportInstance} from 'winston';

@injectable()
export class LogConfig implements winston.LoggerOptions {

    transports: TransportInstance[];

    constructor() {
        this.transports = [
            // new transports.File({
            //     colorize: false,
            //     filename: './logs/all-logs.log',
            //     handleExceptions: true,
            //     json: true,
            //     level: 'debug',
            // }),
            new transports.Console({
                colorize: true,
                handleExceptions: true,
                json: false,
                level: 'debug',
            }),
            // new MongooseTransport({
            //     handleExceptions: true,
            //     level: 'debug',
            //     timestamp: true,
            // }),
        ];
    }

}
