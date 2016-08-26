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

    constructor() {
        this.configMaps();
    }

    public toUserAvatar(dbmodel: IUserAvatarDBSchema): IUserAvatar {
        const source = MongooseMapperHelper.getObject<IUserAvatarDBSchema>(dbmodel);
        return automapper.map(MODEL_TAGS.UserDBAvatar, MODEL_TAGS.UserAvatar, source);
    }

    public toDBmodel(userAvatar: IUserAvatar): IUserAvatarDBSchema {

        const source = MongooseMapperHelper.getObject<IUserAvatar>(userAvatar);
        return automapper.map(MODEL_TAGS.UserAvatar, MODEL_TAGS.UserDBAvatar, source);
    }

    private configMaps() {
        automapper
            .createMap(MODEL_TAGS.UserDBAvatar, MODEL_TAGS.UserAvatar)
            .forMember('filename', (opts) => {return 'avatar'; })
            .convertToType(UserAvatar);

        automapper
            .createMap(MODEL_TAGS.UserAvatar, MODEL_TAGS.UserDBAvatar)
            .convertToType(userDBAvatarModel);
    }
}

export default UserAvatarMapper;
