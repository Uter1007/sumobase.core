import {IUserDBSchema, userDBModel} from '../models/user.db.model';
import {User} from '../models/user.model';
import { injectable } from 'inversify';
import {IUser} from '../interfaces/user.interface';
import { Deserialize } from 'cerialize';
import {MongooseMapperHelper} from '../../../core/mapper/mongoose.helper';
import {MODEL_TAGS} from '../../../../registry/constants.index';

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
        return automapper.map(MODEL_TAGS.UserModel, MODEL_TAGS.UserDBModel, source);
    }

    public toUser(userModel: IUserDBSchema): User {
        const source = MongooseMapperHelper.getObject<IUserDBSchema>(userModel);
        return automapper.map(MODEL_TAGS.UserDBModel, MODEL_TAGS.UserModel, source);
    }

    private configMaps() {
        automapper
            .createMap(MODEL_TAGS.UserModel, MODEL_TAGS.UserDBModel)
            .convertToType(userDBModel);

        automapper
            .createMap(MODEL_TAGS.UserDBModel, MODEL_TAGS.UserModel)
            .forMember('avatar', (opts) => opts.ignore())
            .forMember('password', (opts) => opts.ignore())
            .convertToType(User);
    }
}
