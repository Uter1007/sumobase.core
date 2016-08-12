import {IUserAvatarDBSchema, userDBAvatarModel} from '../models/user.db.model';
import {UserAvatar} from '../models/user.avatar.model';
import {injectable} from 'inversify';
import {IUserAvatar} from '../interfaces/user.avatar.interface';

@injectable()
export class UserAvatarMapper {
    public toUserAvatar(dbmodel: IUserAvatarDBSchema) {
        return new UserAvatar(dbmodel.data, dbmodel.contentType);
    }

    public toUserAvatarDB(userAvatar: IUserAvatar) {
        return new userDBAvatarModel({
            contentType: userAvatar.contentType,
            data: userAvatar.data,
        });
    }
}

export default UserAvatarMapper;
