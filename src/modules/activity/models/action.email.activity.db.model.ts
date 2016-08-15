import * as mongoose from 'mongoose';
import {ActivityType} from './activity.type.enum';
import {IUserDBSchema, userDBModel} from '../../user/models/user.db.model';
import {EntityState} from '../../commons/base/base.state.enum';

export interface IActivityEmailDBSchema extends mongoose.Document {
    createdOn: string;
    hash: string;
    id?: string;
    modifiedOn: string;
    state: EntityState;
    type: ActivityType;
    user: IUserDBSchema;
}

const activityEmailSchema = new mongoose.Schema({
    createdOn: {required: false, type: Date},
    hash: {required: false, type: String},
    modifiedOn: {default: Date.now, required: false, type: Date},
    state: {default: <any>EntityState.ACTIVE,
        enum: [<any>EntityState.ACTIVE, <any>EntityState.DISABLED ],
        required: true,
        type: String, },
    type: {default: <any>ActivityType.ActiviationEmail,
           enum: [<any>ActivityType.ActiviationEmail,
                   <any>ActivityType.ForgotEmail,
                   <any>ActivityType.RecoverdEmail ],
           required: true,
           type: String, },
    user: userDBModel,
});

export const activityEmailDBModel = mongoose.model<IActivityEmailDBSchema>('ActivityEmail', activityEmailSchema);
