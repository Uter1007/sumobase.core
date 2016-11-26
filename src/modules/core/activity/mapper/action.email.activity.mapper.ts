import { injectable, inject } from 'inversify';

import {IActivityEmailDBSchema,
        activityEmailDBSchemaNameInterface,
        activityEmailDBModel} from '../models/action.email.activity.db.model';
import {ActionEmail, IActivityEmail, activityEmailInterfaceName} from '../models/action.email.activity.model';
import {UserMapper} from '../../../feat/user/mapper/user.mapper';
import {IUserDBSchema} from '../../../feat/user/models/user.db.model';
import {MongooseMapperHelper} from '../../mapper/mongoose.helper';
import {ObjectID} from 'mongodb';

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
        return automapper.map(activityEmailInterfaceName,
                              activityEmailDBSchemaNameInterface, model);
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
            .forMember('_id', (opts) => { return new ObjectID(opts.mapFrom('id')) })
            .forMember('hash', (opts) => { opts.mapFrom('hash') })
            .forMember('type', (opts) => { opts.mapFrom('type') })
            .forMember('state', (opts) => { opts.mapFrom('state') })
            .forMember('modifiedOn', (opts) => { opts.mapFrom('modifiedOn') })
            .forMember('createdOn', (opts) => { opts.mapFrom('createdOn') })
            .forMember('user', (opts) => { return opts.sourceObject[opts.sourcePropertyName]
                ? opts.sourceObject[opts.sourcePropertyName].id
                : undefined; })
            .convertToType(activityEmailDBModel);

        automapper
            .createMap(activityEmailDBSchemaNameInterface, activityEmailInterfaceName)
            .forMember('id', (opts) => {
                const i = opts.mapFrom('_id');
                if (i) {
                    return i.toString();
                }
            })
            .forMember('hash', (opts) => { opts.mapFrom('hash') })
            .forMember('type', (opts) => { opts.mapFrom('type') })
            .forMember('state', (opts) => { opts.mapFrom('state') })
            .forMember('modifiedOn', (opts) => { opts.mapFrom('modifiedOn') })
            .forMember('createdOn', (opts) => { opts.mapFrom('createdOn') })
            .convertToType(ActionEmail);
    }
}
