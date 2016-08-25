import {IUserDBSchema, userDBModel} from '../models/user.db.model';
import {User} from '../models/user.model';
import { injectable } from 'inversify';
import {IUser} from '../interfaces/user.interface';
import { Deserialize } from 'cerialize';
import MongooseMapperHelper from '../../commons/mapper/mongoose.helper';

/* tslint:disable */
const automapper = require('automapper-ts');
/* tslint:enable */

@injectable()
export class UserMapper {

    public fromJSON(json: any): User {
        return Deserialize(json, User);
    }

    public toDBmodel(model: IUser): IUserDBSchema {
        const source = MongooseMapperHelper.getObject<IUser>(model);
        const sourceKey = 'IUser';
        const destinationKey = 'IUserDBSchema';

        automapper
            .createMap(sourceKey, destinationKey)
            .convertToType(userDBModel);

        return automapper.map(sourceKey, destinationKey, source);
    }

    public toUser(userModel: IUserDBSchema): User {

        const source = MongooseMapperHelper.getObject<IUserDBSchema>(userModel);
        const sourceKey = 'IUserDBSchema';
        const destinationKey = 'User';

        automapper
            .createMap(sourceKey, destinationKey)
            .forMember('avatar', (opts) => opts.ignore())
            .forMember('password', (opts) => opts.ignore())
            .convertToType(User);

        return automapper.map(sourceKey, destinationKey, source);
    }
}

export default UserMapper;
