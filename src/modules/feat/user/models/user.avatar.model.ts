export const userAvatarInterfaceName = 'IUserAvatar';
export interface IUserAvatar {
    data: Buffer;
    contentType: string;
    filename: string;
}

export class UserAvatar implements IUserAvatar {

    public filename: string;

    constructor(public data, public contentType) {
        this.filename = 'avatar';
    }

}

