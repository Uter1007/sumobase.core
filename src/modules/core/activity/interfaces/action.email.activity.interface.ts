import {ActivityType} from '../models/activity.type.enum';
import {EntityState} from '../../../core/base/base.state.enum';
import {IUser} from '../../../feat/user/interfaces/user.interface';
export interface IActivityEmail {
    createdOn: string;
    hash: string;
    id?: string;
    modifiedOn: string;
    state: EntityState;
    type: ActivityType;
    user: IUser;
}
