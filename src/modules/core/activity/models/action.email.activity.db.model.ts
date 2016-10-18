import * as mongoose from 'mongoose';
import {ActivityType} from './activity.type.enum';
import {EntityState} from '../../../core/base/base.state.enum';

export const activityEmailDBSchemaNameInterface = 'IActivityEmailDBSchema';

export interface IActivityEmailDBSchema extends mongoose.Document {
    createdOn: string;
    hash: string;
    id?: string;
    modifiedOn: string;
    state: EntityState;
    type: ActivityType;
    user: string;
}

const activityEmailSchema = new mongoose.Schema({
    createdOn: {required: false, type: Date},
    hash: {required: false, type: String},
    modifiedOn: {default: Date.now, required: false, type: Date},
    state: {default: <any>EntityState.ACTIVE,
        enum: [<any>EntityState.ACTIVE, <any>EntityState.DISABLED ],
        required: true,
        type: String, },

    type: {default: <any>ActivityType.ActivationEmail,
           enum: [<any>ActivityType.ActivationEmail,
                   <any>ActivityType.ForgotEmail,
                   <any>ActivityType.RecoveredEmail ],
           required: true,
           type: String, },
    user: { required: true, type: String  }
});

export const activityEmailDBModel = mongoose.model<IActivityEmailDBSchema>('ActivityEmail', activityEmailSchema);
