import {transports} from 'winston';
import { injectable } from 'inversify';
import * as winston from 'winston';
import {TransportInstance} from 'winston';

@injectable()
export class LogConfig implements winston.LoggerOptions {

    public transports: TransportInstance[];

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
