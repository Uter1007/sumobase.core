import {IUserAvatarDBSchema} from '../models/user.db.model';
import {UserAvatar} from '../models/user.avatar.model';
import {injectable} from 'inversify';

@injectable()
export class UserAvatarMapper {
    public toUserAvatar(dbmodel: IUserAvatarDBSchema) {
        return new UserAvatar(dbmodel.data, dbmodel.contentType);
    }
}

export default UserAvatarMapper;
