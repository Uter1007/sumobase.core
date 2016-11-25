import { UserState } from '../models/userstate.model';
import { injectable } from 'inversify';
import {BaseModel} from '../../../core/base/base.model';

import {IsLength, IsEmail} from 'validator.ts/decorator/Validation';
import 'reflect-metadata';

export const userInterfaceName = 'IUser';

export interface IUser {
    id?: string;
    createdOn: string;
    email: string;
    firstName: string;
    image?: string;
    lastName: string;
    modifiedOn: string;
    state: UserState;
}

@injectable()
export class User extends BaseModel implements IUser {
    public id: string;

    @IsEmail()
    @IsLength(1, 200)
    public email: string;

    @IsLength(1, 100)
    public firstName: string;

    @IsLength(1, 100)
    public lastName: string;

    public state: UserState;

    public createdOn: string;

    public modifiedOn: string;

    constructor(email?, firstname?, lastname?, userState?, modifiedOn?, createdOn?, id?) {
        super();
        this.id = id;
        this.email = email;
        this.firstName = firstname;
        this.lastName = lastname;
        this.state = userState || UserState.PENDING;
        this.modifiedOn = modifiedOn;
        this.createdOn = createdOn;
    }
}
