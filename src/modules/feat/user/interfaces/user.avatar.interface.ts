export let IUserAvatarName = 'IUserAvatar';

export interface IUserAvatar {
    data: Buffer;
    contentType: string;
    filename: string;
}
