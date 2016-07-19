import * as winston from 'winston';
import {LogLevel, ILogModel, IMongooseTransportOptions} from './logModel';
import {LogRepository} from './logRepository';
import * as moment from 'moment';

export class MongooseTransport extends winston.Transport {

    private _logRepository: LogRepository;

    constructor(options: IMongooseTransportOptions) {
        super(options);
        this._logRepository = new LogRepository();
    }

    public log(level: LogLevel, message: string, metadata: any, callback: any) {
        const logEntry: ILogModel = <ILogModel>{
            level: level,
            message: message,
            metadata: metadata,
            timestamp: moment().utc().toDate(),
        };

        return this._logRepository.create(logEntry)
            .then((result: any) => {
                callback(null, result);
            })
            .catch((error: any) => {
                callback(error);
            });
    };
}
