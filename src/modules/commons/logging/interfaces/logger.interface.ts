import {LogLevel} from '../models/loglevel.model';

export interface ILogger {
    warn(msg: string): void;
    info(msg: string): void;
    error(msg: string, err: any): void;
    debug(msg: any): void;
    setLevel(leven: LogLevel): ILogger;
}
