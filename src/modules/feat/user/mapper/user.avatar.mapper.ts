import {IUserAvatarDBSchema, userDBAvatarModel} from '../models/user.db.model';
import {UserAvatar} from '../models/user.avatar.model';
import {injectable} from 'inversify';
import {IUserAvatar} from '../interfaces/user.avatar.interface';
import MongooseMapperHelper from '../../../core/mapper/mongoose.helper';
import MODEL_TAGS from '../../../../constants/models.tags';

/* tslint:disable */
const automapper = require('automapper-ts');
/* tslint:enable */

@injectable()
export class UserAvatarMapper {
    public toUserAvatar(dbmodel: IUserAvatarDBSchema): IUserAvatar {
        const source = MongooseMapperHelper.getObject<IUserAvatarDBSchema>(dbmodel);

        automapper
            .createMap(MODEL_TAGS.UserDBAvatar, MODEL_TAGS.UserAvatar)
            .forMember('filename', (opts) => {return 'avatar'; })
            .convertToType(UserAvatar);

        return automapper.map(MODEL_TAGS.UserDBAvatar, MODEL_TAGS.UserAvatar, source);

    }

    public toDBmodel(userAvatar: IUserAvatar): IUserAvatarDBSchema {

        const source = MongooseMapperHelper.getObject<IUserAvatar>(userAvatar);

        automapper
            .createMap(MODEL_TAGS.UserAvatar, MODEL_TAGS.UserDBAvatar)
            .convertToType(userDBAvatarModel);

        return automapper.map(MODEL_TAGS.UserAvatar, MODEL_TAGS.UserDBAvatar, source);
    }
}

export default UserAvatarMapper;
