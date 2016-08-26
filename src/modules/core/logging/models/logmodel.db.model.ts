import {LoggerOptions} from 'winston';
import * as mongoose from 'mongoose';
import {GenericTransportOptions} from 'winston';
import {LogLevel} from './loglevel.model';

export interface ILogOptions extends IBaseLoggerOptions {
    morganLogFormat: string;
}

export interface IBaseLoggerOptions {
    streamLogLevel: LogLevel;
    winstonOptions: LoggerOptions;
}

export interface IMongooseTransportOptions extends GenericTransportOptions {
    timestamp?: boolean;
}

export interface ILogModel extends mongoose.Document {

    level: LogLevel;
    message: string;
    timestamp: Date;
    metadata: any;
}

export class LogModel {

    static get schema() {
        let schema = new mongoose.Schema({
            level: { required: true, type: String },
            message: { required: true, type: String },
            metadata: { required: false, type: Object },
            timestamp: { required: true, type: Date },
        });

        return schema;
    }

    static get name() {
        return 'Log';
    }
}

export const logDAO = mongoose.model<ILogModel>(LogModel.name, LogModel.schema);
