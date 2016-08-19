import { injectable, inject } from 'inversify';
import {IActivityEmail} from '../interfaces/action.email.activity.interface';
import {IActivityEmailDBSchema, activityEmailDBModel} from '../models/action.email.activity.db.model';
import {ActionEmail} from '../models/action.email.activity.model';
import {UserMapper} from '../../user/mapper/user.mapper';
import MAPPER_TAGS from '../../../constants/mapper.tags';
import {IUserDBSchema} from '../../user/models/user.db.model';

@injectable()
export class ActionEmailMapper {

    private _userMapper: UserMapper;

    constructor(@inject(MAPPER_TAGS.UserMapper) userMapper: UserMapper) {
        this._userMapper = userMapper;
    }

    public toDBmodel(model: IActivityEmail): IActivityEmailDBSchema {
        let userdb: IActivityEmailDBSchema = new activityEmailDBModel({
            createdOn: model.createdOn,
            hash: model.hash,
            id: model.id,
            state: model.state,
            type: model.type,
            user: model.user ? model.user.id : undefined,
        });

        return userdb;
    }

    public toActivityEmail(activityModel: IActivityEmailDBSchema, userModel: IUserDBSchema): ActionEmail {
        return new ActionEmail(activityModel.hash,
                               activityModel.type,
                               userModel ? this._userMapper.toUser(userModel) : undefined,
                               activityModel.id,
                               activityModel.state,
                               activityModel.createdOn,
                               activityModel.modifiedOn);
    }
}

export default ActionEmailMapper;
