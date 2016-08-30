'use strict';

import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import { injectable, inject } from 'inversify';
import {ILogger, ILoggerName} from '../logging/interfaces/logger.interface';
import {IUserDBSchema} from '../../feat/user/models/user.db.model';

/* tslint:disable */
import moment = require('moment');
import {IBaseRepository} from './base.repository.interface';
/* tslint:enable */

@injectable()
class BaseRepository<T extends mongoose.Document> implements IBaseRepository {

    protected _model: mongoose.Model<mongoose.Document>;

    constructor(@inject(ILoggerName) protected _log: ILogger) {
    }

    public create: ((item: T) => Promise<any>) = (item: T) => {

        return new Promise<any>( (resolve: any, reject: any) => {
            this._model.create(item, (error: any, result: any): void => {
                if (error) {
                    this._log.error('model.create error: ', error);
                    return reject(error);
                } else {
                    this._log.debug('model.create success');
                    return resolve(result);
                }
            });
        });
    };

    public retrieveAll: (() => Promise<any[]>) = () => {
        return new Promise<any[]>( (resolve: any, reject: any) => {
            this._model.find({}, (error: any, result: any): void => {
                if (error) {
                    this._log.error('model.retrieveAll error: ', error);
                    return reject(error);
                } else {
                    this._log.debug('model.retrieveAll success');
                    return resolve(result);
                }
            });
        });
    };

    public findOne: ((query: any) => Promise<any>) = (query: any) => {
        return new Promise<IUserDBSchema>( (resolve: any, reject: any) => {
            this._model.findOne(query, (error: any, result: any): void => {
                if (error) {
                    this._log.error('model.findOne error: ', error);
                    return reject(error);
                } else {
                    this._log.debug('model.findOne success');
                    return resolve(result);
                }
            });
        });
    };

    public find: ((query: any) => Promise<any[]> ) = (query: any) => {
        return new Promise<any[]>( (resolve: any, reject: any) => {
            this._model.find(query, (error: any, result: any): void => {
                if (error) {
                    this._log.error('model.find error: ', error);
                    return reject(error);
                } else {
                    this._log.debug('model.find success');
                    return resolve(result);
                }
            });
        });
    };

    public update: ((_id: string, item: T) =>  Promise<boolean>) = (_id: string, item: T)  => {
        return new Promise<boolean>( (resolve: any, reject: any) => {
            this._model.update({_id: this.toObjectId(_id)}, item, (error: any, result: any): void => {
                if (error) {
                    this._log.error('model.find error: ', error);
                    return reject(error);
                } else {
                    this._log.debug('model.update success for ' + _id);
                    return resolve(true);
                }
            });
        });
    };

    public delete: ((_id: string) => Promise<boolean>) = (_id: string) => {
        return new Promise<boolean>( (resolve: any, reject: any) => {
            this._model.remove({_id: this.toObjectId(_id)}, (error: any) => {
                if (error) {
                    this._log.error('model.delete error: ', error);
                    return reject(error);
                } else {
                    this._log.debug('model.delete success');
                    return resolve(true);
                }
            });
        });
    };

    public findById: ((_id: string) => Promise<any>) = (_id: string) => {
        return new Promise<any>( (resolve: any, reject: any) => {
            this._model.findById(_id, (error: any, result: any): void => {
                if (error) {
                    this._log.error('model.findById error: ', error);
                    return reject(error);
                } else {
                    this._log.debug('model.findById success');
                    return resolve(result);
                }
            });
        });
    };

    public toObjectId: ((_id: string) => mongoose.Types.ObjectId ) = (_id: string) => {
        return mongoose.Types.ObjectId.createFromHexString(_id);
    };
}

export {BaseRepository};
