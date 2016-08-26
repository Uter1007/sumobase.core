import {IUserAvatar} from '../interfaces/user.avatar.interface';
export class UserAvatar implements IUserAvatar {

    public data: Buffer;
    public contentType: string;
    public filename: string;

    constructor(data, contentType) {
        this.data = data;
        this.contentType = contentType;
        this.filename = 'avatar';
    }

}

