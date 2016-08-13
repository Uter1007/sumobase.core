import * as winston from 'winston';
import {ILogger} from '../interfaces/logger.interface';
import { injectable } from 'inversify';
import kernel from '../../../../bootstrap';
import {LogLevel} from '../models/loglevel.model';
import SVC_TAGS from '../../../../constant/services.tags';
import {LogConfig} from '../../../../config/log.config';

export function WinstonLoggerFactory(cfg?: winston.LoggerOptions): new (...args) => ILogger {
    'use strict';

    cfg = cfg ||  {
            transports: [
                new winston.transports.Console({
                    colorize: true,
                    handleExceptions: true,
                    json: false,
                    level: 'debug',
                })
            ]
        };

    @injectable()
    class WinstonLogger implements ILogger {
        private _logger: winston.LoggerInstance;

        constructor() {
            this._logger = new winston.Logger(cfg);
            this._logger.setLevels((<any>winston).config.syslog.levels);
            this.setLevel(LogLevel.DEBUG);
        }

        public crit(msg: string, err: any): void {
            this._logger.log('crit', `${msg} \n ${(err && err.toString()) || '?'}`);
        }

        public warn(msg: string): void {
            this._logger.log('warning', msg);
        }

        public info(msg: string): void {
            this._logger.log('info', msg);
        }

        public error(msg: string, err: any): void {
            this._logger.log('error', `${msg} \n ${(err && err.toString()) || '?'}`);
        }

        public debug(msg: string): void {
            this._logger.log('debug', msg);
        }

        public setLevel(level: LogLevel): ILogger {
            let levelStr: string = null;
            switch (level) {
                case LogLevel.CRITICAL:
                    levelStr = 'crit';
                    break;
                case LogLevel.ERROR:
                    levelStr = 'error';
                    break;
                case LogLevel.WARNING:
                    levelStr = 'warning';
                    break;
                case LogLevel.INFO:
                    levelStr = 'info';
                    break;
                case LogLevel.DEBUG:
                    levelStr = 'debug';
                    break;
                default:
                    levelStr = 'debug';
                    break;
            }
            this._logger.level = levelStr;
            return this;
        }
    };

    return WinstonLogger;
}
