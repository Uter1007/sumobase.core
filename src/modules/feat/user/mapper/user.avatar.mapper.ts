import {IUserAvatarDBSchema,
        userAvatarDBSchemaInterfaceName,
        userDBAvatarModel} from '../models/user.db.model';
import {UserAvatar, IUserAvatar, userAvatarInterfaceName} from '../models/user.avatar.model';
import {injectable} from 'inversify';
import {MongooseMapperHelper} from '../../../core/mapper/mongoose.helper';

/* tslint:disable */
const automapper = require('automapper-ts');
/* tslint:enable */

@injectable()
export class UserAvatarMapper {

    constructor() {
        this.configMaps();
    }

    public toUserAvatar(dbmodel: IUserAvatarDBSchema): IUserAvatar {
        return automapper.map(userAvatarDBSchemaInterfaceName, UserAvatar.name, dbmodel);
    }

    public toDBmodel(userAvatar: IUserAvatar): IUserAvatarDBSchema {

        const source = MongooseMapperHelper.getObject<IUserAvatar>(userAvatar);
        return automapper.map(userAvatarInterfaceName, userAvatarDBSchemaInterfaceName, source);
    }

    private configMaps() {
        automapper
            .createMap(userAvatarDBSchemaInterfaceName, userAvatarInterfaceName)
            .forMember('data', (opts) => { opts.mapFrom('data') })
            .forMember('contentType', (opts) => { opts.mapFrom('contentType') })
            .forMember('filename', (opts) => {return 'avatar'; })
            .convertToType(UserAvatar);

        automapper
            .createMap(userAvatarInterfaceName, userAvatarDBSchemaInterfaceName)
            .forMember('data', (opts) => { opts.mapFrom('data') })
            .forMember('contentType', (opts) => { opts.mapFrom('contentType') })
            .forMember('filename', (opts) => { opts.mapFrom('filename') })
            .convertToType(userDBAvatarModel);
    }
}
