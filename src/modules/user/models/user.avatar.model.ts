import {IUserAvatar} from '../interfaces/user.avatar.interface';
export class UserAvatar implements IUserAvatar {

    data: Buffer;
    contentType: string;
    filename: string;

    constructor(data, contentType){
        this.data = data;
        this.contentType = contentType;
        this.filename = 'avatar';
    }

}

