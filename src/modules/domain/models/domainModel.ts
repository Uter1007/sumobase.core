import * as mongoose from 'mongoose';
import {IDBBaseModel} from '../../../commons/base/baseModel';

export interface IDomainModel extends IDBBaseModel {
    dummy: string;
}

export class DomainSchema {

    static get schema() {
        let schema = new mongoose.Schema({
            dummy: { type: String },
        });
        return schema;
    }

    static get name() {
        return 'Menu';
    }
}

export const domainModel = mongoose.model<IDomainModel>(DomainSchema.name, DomainSchema.schema);
