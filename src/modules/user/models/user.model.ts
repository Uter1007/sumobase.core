import * as mongoose from 'mongoose';
import {IAccountModel, AccountSchema} from '../../account/models/account.model';
import {IDBBaseModel} from '../../../commons/base/base.mongoose.model';

export enum UserState {
    PENDING = <any>'pending',
    ACTIVE = <any>'active',
    DISABLED = <any>'disabled',
}

export enum UserRole {
    EMPLOYEE = <any>'employee',
    SUPERVISOR = <any>'supervisor',
    ADMIN = <any>'admin',
}

export interface IUserModel extends IDBBaseModel {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    linkedUsers: [IUserModel];
    email?: string;
    account: IAccountModel;
    state: UserState;
    role: UserRole;
    createdOn: string;
    modifiedOn: string;
}

export class UserSchema {

    static get schema() {
        let schema = new mongoose.Schema({
                account: {ref: AccountSchema.name, required: true, type: mongoose.Schema.Types.ObjectId},
                createdOn: {required: false, type: Date},
                email: {required: false, type: String},
                firstName: {required: false, type: String},
                lastName: {required: false, type: String},
                linkedUsers: [{ref: UserSchema.name, type: mongoose.Schema.Types.ObjectId}],
                modifiedOn: {default: Date.now, required: false, type: Date},
                password: {required: true, type: String},
                role: {default: <any>UserRole.EMPLOYEE,
                       enum: [UserRole.EMPLOYEE, UserRole.SUPERVISOR, UserRole.ADMIN],
                       required: true,
                       type: String, },
                state: {default: <any>UserState.PENDING,
                        enum: [<any>UserState.PENDING, <any>UserState.ACTIVE, <any>UserState.DISABLED ],
                        required: true,
                        type: String, },
                username: {required: true, type: String},
            });

        return schema;
    }

    static get name() {
        return 'User';
    }
}

export const userModel = mongoose.model<IUserModel>(UserSchema.name, UserSchema.schema);
