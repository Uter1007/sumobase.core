'use strict';

import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
// import {LogLevel} from '../logging/models/loglevel.model';
import { injectable } from 'inversify';

@injectable()
class BaseRepository<T extends mongoose.Document> {

    private _model: mongoose.Model<mongoose.Document>;
    constructor (schemaModel: mongoose.Model<mongoose.Document>) {
        this._model = schemaModel;
    }

    public create: ((item: T) => Promise<any>) = (item: T) => {
        return new Promise( (resolve: any, reject: any) => {
            this._model.create(item, (error: any, result: any): void => {
                if (error) {
                    // this.log(LogLevel.ERROR, 'model.create error: ' + error);
                    return reject(error);
                } else {
                    // this.log(LogLevel.DEBUG, 'model.create success');
                    return resolve(result);
                }
            });
        });
    };

    public retrieveAll: (() => Promise<any>) = () => {
        return new Promise( (resolve: any, reject: any) => {
            this._model.find({}, (error: any, result: any): void => {
                if (error) {
                    // this.log(LogLevel.ERROR, 'model.retrieveAll error: ' + error);
                    return reject(error);
                } else {
                    // this.log(LogLevel.DEBUG, 'model.retrieveAll success');
                    return resolve(result);
                }
            });
        });
    };

    public findOne: ((query: any) => Promise<any>) = (query: any) => {
        return new Promise( (resolve: any, reject: any) => {
            this._model.findOne(query, (error: any, result: any): void => {
                if (error) {
                    // this.log(LogLevel.ERROR, 'model.findOne error: ' + error);
                    return reject(error);
                } else {
                    // this.log(LogLevel.DEBUG, 'model.findOne success');
                    return resolve(result);
                }
            });
        });
    };

    public find: ((query: any) => Promise<any> ) = (query: any) => {
        return new Promise( (resolve: any, reject: any) => {
            this._model.find(query, (error: any, result: any): void => {
                if (error) {
                   //  this.log(LogLevel.ERROR, 'model.find error: ' + error);
                    return reject(error);
                } else {
                    // this.log(LogLevel.DEBUG, 'model.find success');
                    return resolve(result);
                }
            });
        });
    };

    public update: ((_id: string, item: T) =>  Promise<any>) = (_id: string, item: T)  => {
        return new Promise( (resolve: any, reject: any) => {
            this._model.update({_id: this.toObjectId(_id)}, item, (error: any, result: any): void => {
                if (error) {
                    // this.log(LogLevel.ERROR, 'model.update error: ' + error);
                    return reject(error);
                } else {
                    // this.log(LogLevel.DEBUG, 'model.update success for ' + _id);
                    return resolve(result);
                }
            });
        });
    };

    public delete: ((_id: string) => Promise<any>) = (_id: string) => {
        return new Promise( (resolve: any, reject: any) => {
            this._model.remove({_id: this.toObjectId(_id)}, (error: any) => {
                if (error) {
                    // this.log(LogLevel.ERROR, 'model.delete error: ' + error);
                    return reject(error);
                } else {
                    // this.log(LogLevel.DEBUG, 'model.delete success');
                    return resolve(null);
                }
            });
        });
    };

    public findById: ((_id: string) => Promise<any>) = (_id: string) => {
        return new Promise( (resolve: any, reject: any) => {
            this._model.findById(_id, (error: any, result: any): void => {
                if (error) {
                    // this.log(LogLevel.ERROR, 'model.findById error: ' + error);
                    return reject(error);
                } else {
                    // this.log(LogLevel.DEBUG, 'model.findById success');
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
