import {IUserDBSchema, userDBSchemaInterfaceName, userDBModel} from '../models/user.db.model';
import {User, IUser, userInterfaceName} from '../models/user.model';
import { injectable } from 'inversify';
import {MongooseMapperHelper} from '../../../core/mapper/mongoose.helper';
import {ObjectID} from 'mongodb';
import {Deserialize} from 'cerialize';

/* tslint:disable */
const automapper = require('automapper-ts');
/* tslint:enable */

@injectable()
export class UserMapper {

    constructor() {
        this.configMaps();
    }

    public fromJSON(json: any): IUser {
        return Deserialize(json, User);
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
            .createMap(userInterfaceName, userDBSchemaInterfaceName)
            .forMember('_id', (opts) => { return new ObjectID(opts.mapFrom('id')) })
            .forMember('firstName', (opts) => { opts.mapFrom('firstName') })
            .forMember('lastName', (opts) => { opts.mapFrom('lastName') })
            .forMember('email', (opts) => { opts.mapFrom('email') })
            .forMember('state', (opts) => { opts.mapFrom('state') })
            .forMember('modifiedOn', (opts) => { opts.mapFrom('modifiedOn') })
            .forMember('createdOn', (opts) => { opts.mapFrom('createdOn') })
            .convertToType(userDBModel);

        automapper
            .createMap(userDBSchemaInterfaceName, userInterfaceName)
            .forMember('avatar', (opts) => opts.ignore())
            .forMember('password', (opts) => opts.ignore())
            .forMember('id', (opts) => {
                const i = opts.mapFrom('_id');
                if (i) {
                    return i.toString();
                }
            })
            .forMember('firstName', (opts) => { opts.mapFrom('firstName') })
            .forMember('lastName', (opts) => { opts.mapFrom('lastName') })
            .forMember('email', (opts) => { opts.mapFrom('email') })
            .forMember('state', (opts) => { opts.mapFrom('state') })
            .forMember('modifiedOn', (opts) => { opts.mapFrom('modifiedOn') })
            .forMember('createdOn', (opts) => { opts.mapFrom('createdOn') })
            .convertToType(User);
    }
}
