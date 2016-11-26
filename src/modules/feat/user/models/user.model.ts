import { UserState } from '../models/userstate.model';
import { injectable } from 'inversify';
import {BaseModel} from '../../../core/base/base.model';

import {IsLength, IsEmail} from 'validator.ts/decorator/Validation';
import 'reflect-metadata';
import {autoserialize} from 'cerialize';
import {IUserDBSchema, userDBModel} from './user.db.model';
import {ObjectID} from 'mongodb';
import {IUserAvatar} from './user.avatar.model';

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

    public password: string;

    constructor() {
        super();
        this.state = UserState.PENDING;
    }

    public toDB(): IUserDBSchema {

        let userdb = new userDBModel();

        userdb.createdOn = this.createdOn;
        userdb.modifiedOn = this.modifiedOn;
        userdb.firstName = this.firstName;
        userdb.lastName = this.lastName;
        userdb.email = this.email;
        userdb.state = this.state;

        userdb.password = this.password;

        if (this.id){
            userdb._id = new ObjectID(this.id);

        }

        return userdb;
    }
}
