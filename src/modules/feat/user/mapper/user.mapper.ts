import {IUserDBSchema, userDBSchemaInterfaceName, userDBModel} from '../models/user.db.model';
import {User, IUser, userInterfaceName} from '../models/user.model';
import { injectable } from 'inversify';
import {MongooseMapperHelper} from '../../../core/mapper/mongoose.helper';
import {ObjectID} from 'mongodb';

/* tslint:disable */
const automapper = require('automapper-ts');
/* tslint:enable */

@injectable()
export class UserMapper {

    constructor() {
        this.configMaps();
    }

    public fromJSON(json: any): IUser {
        return automapper.map('{}', userInterfaceName, json);
    }

    public toDBmodel(model: IUser): IUserDBSchema {
        return automapper.map(userInterfaceName, userDBSchemaInterfaceName, model);
    }

    public toUser(userModel: IUserDBSchema): User {
        const source = MongooseMapperHelper.getObject<IUserDBSchema>(userModel);
        return automapper.map(userDBSchemaInterfaceName, userInterfaceName, source);
    }

    private configMaps() {

        automapper
            .createMap('{}', userInterfaceName)
            .convertToType(User);

        automapper
            .createMap(userInterfaceName, userDBSchemaInterfaceName)
            .convertToType(userDBModel);

        automapper
            .createMap(userDBSchemaInterfaceName, userInterfaceName)
            .forMember('avatar', (opts) => opts.ignore())
            .forMember('password', (opts) => opts.ignore())
            .convertToType(User);
    }
}
