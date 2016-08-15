import { injectable, inject } from 'inversify';
import {IActivityEmail} from '../interfaces/action.email.activity.interface';
import {IActivityEmailDBSchema, activityEmailDBModel} from '../models/action.email.activity.db.model';
import {ActionEmail} from '../models/action.email.activity.model';
import {UserMapper} from '../../user/mapper/user.mapper';
import MAPPER_TAGS from '../../../constant/mapper.tags';

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
            user: this._userMapper.toDBmodel(model.user),
        });

        return userdb;
    }

    public toActivityEmail(userModel: IActivityEmailDBSchema): ActionEmail {
        return new ActionEmail(userModel.hash,
                               userModel.type,
                               this._userMapper.toUser(userModel.user),
                               userModel.id,
                               userModel.state,
                               userModel.createdOn,
                               userModel.modifiedOn);
    }
}

export default ActionEmailMapper;
