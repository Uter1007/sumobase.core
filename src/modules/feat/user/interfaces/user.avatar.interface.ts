export const userAvatarInterfaceName = 'IUserAvatar';

export interface IUserAvatar {
    data: Buffer;
    contentType: string;
    filename: string;
}
