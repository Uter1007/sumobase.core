import {ActivityType} from '../models/activity.type.enum';
import {IUser} from '../../user/interfaces/user.interface';
import {EntityState} from '../../commons/base/base.state.enum';
export interface IActivityEmail {
    createdOn: string;
    hash: string;
    id?: string;
    modifiedOn: string;
    state: EntityState;
    type: ActivityType;
    user: IUser;
}
