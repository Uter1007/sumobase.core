import {IUserAvatarDBSchema,
        userAvatarDBSchemaInterfaceName,
        userDBAvatarModel} from '../models/user.db.model';
import {UserAvatar} from '../models/user.avatar.model';
import {injectable} from 'inversify';
import {IUserAvatar, userAvatarInterfaceName} from '../interfaces/user.avatar.interface';
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
        const source = MongooseMapperHelper.getObject<IUserAvatarDBSchema>(dbmodel);
        return automapper.map(userAvatarDBSchemaInterfaceName, UserAvatar.name, source);
    }

    public toDBmodel(userAvatar: IUserAvatar): IUserAvatarDBSchema {

        const source = MongooseMapperHelper.getObject<IUserAvatar>(userAvatar);
        return automapper.map(userAvatarInterfaceName, userAvatarDBSchemaInterfaceName, source);
    }

    private configMaps() {
        automapper
            .createMap(userAvatarDBSchemaInterfaceName, userAvatarInterfaceName)
            .forMember('filename', (opts) => {return 'avatar'; })
            .convertToType(UserAvatar);

        automapper
            .createMap(userAvatarInterfaceName, userAvatarDBSchemaInterfaceName)
            .convertToType(userDBAvatarModel);
    }
}
