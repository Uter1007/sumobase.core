'use strict';

// typings
import {transports, LoggerOptions} from 'winston';
import {ILogOptions, LogLevel} from '../../commons/logger/log.model';
import {MongooseTransport} from '../../commons/logger/winston.mongoose.transport';

const logFileName: string = './logs/all-logs.log';

export class TestConfig {

    public static db: any = {
        // enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false,
        options: {
            pass: '{{ db.pass }}',
            user: '{{ db.user }}',
        },
        uri: '{{ db.uri }}'
    };

    public static fixtureDb: any = {
        // enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false,
        options: {
            pass: '{{ fixtureDb.pass }}',
            user: '{{ fixtureDb.user }}',
        },
        uri: '{{ fixtureDb.uri }}'
    };

    public static password: any = {
        saltRounds: 10,
    };

    public static token: any = {
        expiresIn: 10000,
        secret: '{{ token.secret }}',
    };

    public static mail: any = {
        apiKey: '{{ mail.apiKey }}',
        domain: '{{ mail.domain }}',
    };

    public static generalLogSettings: any = {
        filePath: logFileName,
    };

    public static log: ILogOptions = {
        morganLogFormat: ':method :url :status :response-time ms - :res[content-length]',
        streamLogLevel: LogLevel.DEBUG,
        winstonOptions: <LoggerOptions>{
            exitOnError: false,
            transports: [
                new transports.File({
                    colorize: false,
                    filename: logFileName,
                    handleExceptions: true,
                    json: true,
                    level: 'info',
                }),
                new transports.Console({
                    colorize: true,
                    handleExceptions: true,
                    json: false,
                    level: 'debug',
                }),
                new MongooseTransport({
                    handleExceptions: true,
                    level: 'info',
                    timestamp: true,
                }),
            ],
        },
    };

    public static testLog: ILogOptions = {
        morganLogFormat: ':method :url :status :response-time ms - :res[content-length]',
        streamLogLevel: LogLevel.DEBUG,
        winstonOptions: <LoggerOptions>{
            exitOnError: false,
            transports: [
                new transports.Console({
                    colorize: true,
                    handleExceptions: true,
                    json: false,
                    level: 'debug',
                }),
            ],
        },
    };
}
