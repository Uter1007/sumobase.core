import { UserState } from '../models/userstate.model';
import { injectable } from 'inversify';
import {BaseModel} from '../../../core/base/base.model';

import {IsLength, IsEmail} from 'validator.ts/decorator/Validation';
import 'reflect-metadata';
import {autoserialize} from 'cerialize';
import {IUserDBSchema} from './user.db.model';
import {ObjectID} from 'mongodb';

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

    @autoserialize
    public id: string;

    @autoserialize
    @IsEmail()
    @IsLength(1, 200)
    public email: string;

    @autoserialize
    @IsLength(1, 100)
    public firstName: string;

    @autoserialize
    @IsLength(1, 100)
    public lastName: string;

    @autoserialize
    public state: UserState;

    @autoserialize
    public createdOn: string;

    @autoserialize
    public modifiedOn: string;

    constructor() {
        super();
        this.state = UserState.PENDING;
    }

    public toDB(): IUserDBSchema {

        let user: IUserDBSchema = {
            _id: new ObjectID(this.id),
            createdOn: this.createdOn,
            modifiedOn: this.modifiedOn,
            firstName: this.firstName,

        };

        return user;
    }
}
