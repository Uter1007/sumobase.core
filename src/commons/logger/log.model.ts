import {LoggerOptions} from 'winston';
import * as mongoose from 'mongoose';
import {IDBBaseModel} from '../base/base.mongoose.model';
import {GenericTransportOptions} from 'winston';

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

export enum LogLevel {
    DEBUG = <any>'debug',
    INFO = <any>'info',
    WARN = <any>'warn',
    ERROR = <any>'error',
}

export interface ILogModel extends IDBBaseModel {

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
