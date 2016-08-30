import {LogLevel} from '../models/loglevel.model';

export const ILoggerName = 'ILogger';

export interface ILogger {
    warn(msg: string): void;
    info(msg: string): void;
    error(msg: string, err: any): void;
    debug(msg: any): void;
    setLevel(level: LogLevel): ILogger;
}
