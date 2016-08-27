import {IActivityEmail} from '../interfaces/action.email.activity.interface';
import {ActivityType} from './activity.type.enum';
import {IUser} from '../../../feat/user/interfaces/user.interface';
import {EntityState} from '../../../core/base/base.state.enum';

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
