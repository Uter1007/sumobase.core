import { injectable, inject } from 'inversify';
import {IActivityEmail,
        activityEmailInterfaceName} from '../interfaces/action.email.activity.interface';
import {IActivityEmailDBSchema,
        activityEmailDBSchemaNameInterface,
        activityEmailDBModel} from '../models/action.email.activity.db.model';
import {ActionEmail} from '../models/action.email.activity.model';
import {UserMapper} from '../../../feat/user/mapper/user.mapper';
import {IUserDBSchema} from '../../../feat/user/models/user.db.model';
import {MongooseMapperHelper} from '../../mapper/mongoose.helper';

/* tslint:disable */
const automapper = require('automapper-ts');
/* tslint:enable */

@injectable()
export class ActionEmailMapper {

    private _userMapper: UserMapper;

    constructor(@inject(UserMapper.name) userMapper: UserMapper) {
        this._userMapper = userMapper;
        this.configMaps();
    }

    public toDBmodel(model: IActivityEmail): IActivityEmailDBSchema {
        const source = MongooseMapperHelper.getObject<IActivityEmail>(model);
        return automapper.map(activityEmailInterfaceName,
                              activityEmailDBSchemaNameInterface, source);
    }

    public toActivityEmail(activityModel: IActivityEmailDBSchema, userModel: IUserDBSchema): ActionEmail {

        const source = MongooseMapperHelper.getObject<IActivityEmailDBSchema>(activityModel);
        let result: ActionEmail = automapper.map(activityEmailDBSchemaNameInterface,
                                                 activityEmailInterfaceName, source);

        if (userModel) {
            result.user = this._userMapper.toUser(userModel);
        }

        return result;
    }

    private configMaps() {
        automapper
            .createMap(activityEmailInterfaceName, activityEmailDBSchemaNameInterface)
            .forMember('user', (opts) => { return opts.sourceObject[opts.sourcePropertyName]
                ? opts.sourceObject[opts.sourcePropertyName].id
                : undefined; })
            .convertToType(activityEmailDBModel);

        automapper
            .createMap(activityEmailDBSchemaNameInterface, activityEmailInterfaceName)
            .convertToType(ActionEmail);
    }
}
