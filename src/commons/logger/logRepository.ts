import {ILogModel, logDAO} from './logModel';
import * as mongoose from 'mongoose';

export class LogRepository {

    private _model: mongoose.Model<ILogModel>;

    constructor() {
        this._model = logDAO;
    }

    public create(item: ILogModel): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            this._model.create(item, (error: any, result: any): void => {
                if (error) {
                    console.log('error', 'Error while persisting log in db: ' + error);
                    return reject(error);
                } else {
                    return resolve(result);
                }
            });
        });
    }
}
