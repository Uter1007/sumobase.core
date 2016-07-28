import * as winston from 'winston';
import * as Promise from 'bluebird';
import {IBaseLoggerOptions, LogLevel} from './log.model';
import {TestConfig} from '../../config/env/config';
let fs = require( 'fs' );
let path = require('path');

class BaseLogger {

    public writeStream: any = {
        write: (message: string, encoding?: string): void => {
            this.log(this._config.streamLogLevel, message);
        },
    };

    private _config: IBaseLoggerOptions;
    private _winstonLogger: winston.LoggerInstance;

    constructor(config: IBaseLoggerOptions) {
        this._config = config;
        this._winstonLogger = new winston.Logger(config.winstonOptions);
        this.checkFilePath();
    }

    private checkFilePath() {
        let filepath = TestConfig.generalLogSettings.filePath;
        // let filename =  path.basename(filepath);
        let dirnames = path.dirname(filepath);

        if (!this.isDirSync(dirnames)) {
            fs.mkdirSync(dirnames);
        }

        if (!this.isFileSync(filepath)) {
            fs.closeSync(fs.openSync(filepath, 'w'));
        }
    }

    private isDirSync(aPath: string) {
        try {
            return fs.statSync(aPath).isDirectory();
        } catch (e) {
            if (e.code === 'ENOENT') {
                return false;
            } else {
                throw e;
            }
        }
    }

    private isFileSync(aPath: string) {
        try {
            return fs.statSync(aPath).isFile();
        } catch (e) {
            if (e.code === 'ENOENT') {
                return false;
            } else {
                throw e;
            }
        }
    }

    public log(
        logLevel: LogLevel,
        message: string): Promise<{ level: string, msg: string, meta: string } | Error> {

        return <any>new Promise((resolve: any, reject: any) => {

            this._winstonLogger.log(
                (<LogLevel>logLevel).toString(),
                message,
                (err: Error, level: string, msg: string, meta: any) => {

                    if (err) {
                        console.log('error', 'Error while persisting log in db: ' + err.message);
                        return reject(err);
                    } else {
                        return resolve({ level, msg, meta });
                    }
                });

        });
    };
}

namespace Logger {
    'use strict';

    export var logger;
    if (process.env.NODE_ENV === 'testing') {
        logger = new BaseLogger(TestConfig.testLog);
    } else {
        logger = new BaseLogger(TestConfig.log);
    }
}

export = Logger;
