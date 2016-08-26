import {IActivityEmail} from '../interfaces/action.email.activity.interface';
import {ActivityType} from './activity.type.enum';
import {IUser} from '../../../feat/user/interfaces/user.interface';
import {EntityState} from '../../../core/base/base.state.enum';
export class ActionEmail implements IActivityEmail {
    public createdOn: string;
    public hash: string;
    public id: string;
    public modifiedOn: string;
    public type: ActivityType;
    public user: IUser;
    public state: EntityState;

    constructor(
        hash: string,
        type: ActivityType,
        user: IUser,
        id: string,
        state: EntityState,
        createdOn: string,
        modifiedOn: string
    ) {
        this.id = id;
        this.createdOn = createdOn;
        this.modifiedOn = modifiedOn;
        this.hash = hash;
        this.state = state;
        this.type = type;
        this.user = user;
    }

}
