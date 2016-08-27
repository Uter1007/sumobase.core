import {IUserAvatar} from '../interfaces/user.avatar.interface';
export class UserAvatar implements IUserAvatar {

    public filename: string;

    constructor(public data, public contentType) {
        this.filename = 'avatar';
    }

}

