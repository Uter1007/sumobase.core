import * as mongoose from 'mongoose';
import {IDBBaseModel} from '../../../commons/base/baseModel';

export enum AccountState {
    ACTIVE = <any>'active',
    PENDING = <any>'pending',
    DISABLED = <any>'disabled',
}

export interface IAccountModel extends IDBBaseModel {
    activatedOn: string;
    createdOn: string;
    displayName: string;
    modifiedOn: string;
    name: string;
    selfMaintained: boolean;
    state: AccountState;
}

export class AccountSchema {

    static get schema() {
        let schema = new mongoose.Schema({
            activatedOn: {required: false, type: Date},
            createdOn: {required: false, type: Date},
            displayName: {required: false, type: String},
            modifiedOn: {default: Date.now, required: false, type: Date},
            name: { required: true, type: String },
            selfMaintained: { default: false, required: true, type: Boolean},
            state: { default: AccountState.PENDING,
                     enum: [AccountState.ACTIVE, AccountState.PENDING, AccountState.DISABLED],
                     required: true,
                     type: String, },
        });

        return schema;
    }

    static get name() {
        return 'Account';
    }
}

export const accountModel = mongoose.model<IAccountModel>(AccountSchema.name, AccountSchema.schema);
