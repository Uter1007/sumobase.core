import { injectable } from 'inversify';
import { autoserialize } from 'cerialize';
import { IUser } from '../interfaces/user.interface';
import { UserState } from './userstate.model';
import {BaseModel} from '../../commons/base/base.model';
import { Deserialize } from 'cerialize';
import {IsLength, IsEmail} from 'validator.ts/decorator/Validation';
import 'reflect-metadata';

@injectable()
export class User extends BaseModel implements IUser {

    @autoserialize
    public id: string;

    @autoserialize
    @IsEmail()
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

    public static createFromJSON(json: any) {
        return Deserialize(json, User);
    }

    constructor(email, firstname, lastname, userState, modifiedOn?, createdOn?, id?) {
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
