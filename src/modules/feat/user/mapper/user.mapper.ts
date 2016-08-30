import {IUserDBSchema, IUserDBSchemaName, userDBModel} from '../models/user.db.model';
import {User} from '../models/user.model';
import { injectable } from 'inversify';
import {IUser, IUserName} from '../interfaces/user.interface';
import { Deserialize } from 'cerialize';
import {MongooseMapperHelper} from '../../../core/mapper/mongoose.helper';

/* tslint:disable */
const automapper = require('automapper-ts');
/* tslint:enable */

@injectable()
export class UserMapper {

    constructor() {
        this.configMaps();
    }

    public fromJSON(json: any): User {
        return Deserialize(json, User);
    }

    public toDBmodel(model: IUser): IUserDBSchema {
        const source = MongooseMapperHelper.getObject<IUser>(model);
        return automapper.map(IUserName, IUserDBSchemaName, source);
    }

    public toUser(userModel: IUserDBSchema): User {
        const source = MongooseMapperHelper.getObject<IUserDBSchema>(userModel);
        return automapper.map(IUserDBSchemaName, IUserName, source);
    }

    private configMaps() {
        automapper
            .createMap(IUserName, IUserDBSchemaName)
            .convertToType(userDBModel);

        automapper
            .createMap(IUserDBSchemaName, IUserName)
            .forMember('avatar', (opts) => opts.ignore())
            .forMember('password', (opts) => opts.ignore())
            .convertToType(User);
    }
}
