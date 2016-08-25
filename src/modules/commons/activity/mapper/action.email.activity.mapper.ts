import { injectable, inject } from 'inversify';
import {IActivityEmail} from '../interfaces/action.email.activity.interface';
import {IActivityEmailDBSchema, activityEmailDBModel} from '../models/action.email.activity.db.model';
import {ActionEmail} from '../models/action.email.activity.model';
import {UserMapper} from '../../../user/mapper/user.mapper';
import MAPPER_TAGS from '../../../../constants/mapper.tags';
import {IUserDBSchema} from '../../../user/models/user.db.model';
import MongooseMapperHelper from '../../mapper/mongoose.helper';

/* tslint:disable */
const automapper = require('automapper-ts');
/* tslint:enable */

@injectable()
export class ActionEmailMapper {

    private _userMapper: UserMapper;

    constructor(@inject(MAPPER_TAGS.UserMapper) userMapper: UserMapper) {
        this._userMapper = userMapper;
    }

    public toDBmodel(model: IActivityEmail): IActivityEmailDBSchema {

        const source = MongooseMapperHelper.getObject<IActivityEmail>(model);
        const sourceKey = 'IActivityEmail';
        const destinationKey = 'IActivityEmailDBSchema';

        automapper
            .createMap(sourceKey, destinationKey)
            .forMember('user', (opts) => { return opts.sourceObject[opts.sourcePropertyName]
                                                    ? opts.sourceObject[opts.sourcePropertyName].id
                                                    : undefined; })
            .convertToType(activityEmailDBModel);

        return automapper.map(sourceKey, destinationKey, source);
    }

    public toActivityEmail(activityModel: IActivityEmailDBSchema, userModel: IUserDBSchema): ActionEmail {

        const source = MongooseMapperHelper.getObject<IActivityEmailDBSchema>(activityModel);
        const sourceKey = 'IActivityEmailDBSchema';
        const destinationKey = 'ActionEmail';

        automapper
            .createMap(sourceKey, destinationKey)
            .convertToType(ActionEmail);

        let result: ActionEmail = automapper.map(sourceKey, destinationKey, source);

        if (userModel) {
            result.user = this._userMapper.toUser(userModel);
        }

        return result;
    }
}

export default ActionEmailMapper;
