import * as mongoose from 'mongoose';
import { UserState } from './userstate.model';

export interface IUserAvatarDBSchema extends mongoose.Document {
    contentType: string,
    data: Buffer,
}

export interface IUserDBSchema extends mongoose.Document {
    createdOn?: string;
    email?: string;
    firstName?: string;
    image?: IUserAvatarDBSchema;
    lastName?: string;
    modifiedOn?: string;
    password?: string;
    state?: UserState;
    avatar?: IUserAvatarDBSchema;
}

const userAvatarSchema = new mongoose.Schema({
    contentType: {required: true, type: String},
    data: {required: true, type: Buffer},
});

const userSchema = new mongoose.Schema({
    createdOn: {required: false, type: Date},
    email: {required: false, type: String},
    firstName: {required: false, type: String},
    avatar: userAvatarSchema,
    lastName: {required: false, type: String},
    modifiedOn: {default: Date.now, required: false, type: Date},
    password: {required: true, type: String},
    state: {default: <any>UserState.PENDING,
        enum: [<any>UserState.PENDING, <any>UserState.ACTIVE, <any>UserState.DISABLED ],
        required: true,
        type: String, },
});

export const userDBAvatarModel = mongoose.model<IUserAvatarDBSchema>('UserAvatar', userAvatarSchema);
export const userDBModel = mongoose.model<IUserDBSchema>('User', userSchema);
