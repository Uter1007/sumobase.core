import {ActivityType} from './activity.type.enum';
import {IUser} from '../../../feat/user/models/user.model';
import {EntityState} from '../../../core/base/base.state.enum';

export const activityEmailInterfaceName = 'IActivityEmail';
export interface IActivityEmail {
    createdOn: string;
    hash: string;
    id?: string;
    modifiedOn: string;
    state: EntityState;
    type: ActivityType;
    user: IUser;
}

export class ActionEmail implements IActivityEmail {
    constructor(
        public hash: string,
        public type: ActivityType,
        public user: IUser,
        public id: string,
        public state: EntityState,
        public createdOn: string,
        public modifiedOn: string
    ) {
    }
}
