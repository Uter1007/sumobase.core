import {IUserAvatarDBSchema, userDBAvatarModel} from '../models/user.db.model';
import {UserAvatar} from '../models/user.avatar.model';
import {injectable} from 'inversify';
import {IUserAvatar} from '../interfaces/user.avatar.interface';
import MongooseMapperHelper from '../../../core/mapper/mongoose.helper';

/* tslint:disable */
const automapper = require('automapper-ts');
/* tslint:enable */

@injectable()
export class UserAvatarMapper {
    public toUserAvatar(dbmodel: IUserAvatarDBSchema): IUserAvatar {
        const source = MongooseMapperHelper.getObject<IUserAvatarDBSchema>(dbmodel);
        const sourceKey = 'IUserAvatarDBSchema';
        const destinationKey = 'IUserAvatar';

        automapper
            .createMap(sourceKey, destinationKey)
            .forMember('filename', (opts) => {return 'avatar'; })
            .convertToType(UserAvatar);

        return automapper.map(sourceKey, destinationKey, source);

    }

    public toDBmodel(userAvatar: IUserAvatar): IUserAvatarDBSchema {

        const source = MongooseMapperHelper.getObject<IUserAvatar>(userAvatar);
        const sourceKey = 'IUserAvatar';
        const destinationKey = 'IUserAvatarDBSchema';

        automapper
            .createMap(sourceKey, destinationKey)
            .convertToType(userDBAvatarModel);

        return automapper.map(sourceKey, destinationKey, source);
    }
}

export default UserAvatarMapper;
