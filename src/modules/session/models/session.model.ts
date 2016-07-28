import * as mongoose from 'mongoose';
import {IDBBaseModel} from '../../../commons/base/base.mongoose.model';
import {IUserModel, UserSchema} from '../../user/models/user.model';

export interface ISessionModel extends IDBBaseModel {
    refreshToken: string;
    user: IUserModel;
}

export class SessionSchema {

    static get schema() {
        let schema = new mongoose.Schema({
            refreshToken: {required: false, type: String},
            user: {ref: UserSchema.name, required: true, type: mongoose.Schema.Types.ObjectId},
        });

        return schema;
    }

    static get name() {
        return 'Session';
    }
}

export const sessionModel = mongoose.model<ISessionModel>(SessionSchema.name, SessionSchema.schema);
