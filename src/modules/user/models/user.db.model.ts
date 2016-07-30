import * as mongoose from 'mongoose';
import { UserState } from './userstate.model';

export interface IUserDBSchema extends mongoose.Document {
    createdOn?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    modifiedOn?: string;
    password?: string;
    userState?: UserState;
}

let userSchema = new mongoose.Schema({
    createdOn: {required: false, type: Date},
    email: {required: false, type: String},
    firstName: {required: false, type: String},
    lastName: {required: false, type: String},
    modifiedOn: {default: Date.now, required: false, type: Date},
    password: {required: true, type: String},
    userState: {default: <any>UserState.PENDING,
        enum: [<any>UserState.PENDING, <any>UserState.ACTIVE, <any>UserState.DISABLED ],
        required: true,
        type: String, },
});

export const userDBModel = mongoose.model<IUserDBSchema>('User', userSchema);
