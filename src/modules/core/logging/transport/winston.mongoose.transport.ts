import * as winston from 'winston';
import * as moment from 'moment';
import {LogLevel} from '../models/loglevel.model';
import {LogRepository} from '../repository/log.repository';
import {ILogModel} from '../models/logmodel.db.model';
import {TestLogger} from '../factory/test.logger';

export class MongooseTransport extends winston.Transport {

    private _logRepository: LogRepository;

    constructor(options) {
        super(options);
        this._logRepository = new LogRepository(new TestLogger());
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

