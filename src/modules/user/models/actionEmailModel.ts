import * as mongoose from 'mongoose';
import {IDBBaseModel} from '../../../commons/base/baseModel';
import {IAccountModel, AccountSchema} from '../../account/models/accountModel';
import {IUserModel, UserSchema} from './userModel';

export enum ActionEmailState {
    UNCONFIRMED = <any>'unconfirmed',
    CONFIRMED = <any>'confirmed'
}

export enum ActionEmailType {
    ACCOUNT_CONFIRMATION = <any>'account_confirmation'
}

export interface IActionEmailModel extends IDBBaseModel {
    type: ActionEmailType;
    state: ActionEmailState;
    invalidAt: string;
    user: IUserModel;
    account: IAccountModel;
    createdOn: string;
    modifiedOn: string;
}

export class ActionEmailSchema {

    static get schema() {
        let schema = new mongoose.Schema({
            type: {
                default: <any>ActionEmailType.ACCOUNT_CONFIRMATION,
                enum: [ActionEmailType.ACCOUNT_CONFIRMATION],
                required: true,
                type: String
            },
            state: {
                default: <any>ActionEmailState.UNCONFIRMED,
                enum: [ActionEmailState.UNCONFIRMED],
                required: true,
                type: String
            },
            invalidAt: {default: Date.now, required: true, type: Date},
            user: {ref: UserSchema.name, type: mongoose.Schema.Types.ObjectId},
            account: {ref: AccountSchema.name, type: mongoose.Schema.Types.ObjectId},
            createdOn: {required: false, type: Date},
            modifiedOn: {default: Date.now, required: false, type: Date},
        });

        return schema;
    }

    static get name() {
        return 'ActionEmail';
    }
}

export const actionEmailModel = mongoose.model<IActionEmailModel>(ActionEmailSchema.name, ActionEmailSchema.schema);
