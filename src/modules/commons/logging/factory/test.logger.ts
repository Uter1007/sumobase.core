import {ILogger} from '../interfaces/logger.interface';
import {LogLevel} from '../models/loglevel.model';
export class TestLogger implements ILogger {

    public warn(msg: string): void {
        console.log('Warn: ' + msg);
    }

    public info(msg: string): void {
        console.log('Info: ' + msg);
    }

    public error(msg: string, err: any): void {
        console.log('Error: ' + msg);
    }

    public debug(msg: any): void {
        console.log('Debug: ' + msg);
    }

    public setLevel(leven: LogLevel): ILogger {
        return undefined;
    }
}
