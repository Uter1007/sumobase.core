import { injectable } from 'inversify';
import { autoserialize } from 'cerialize';
import { IUser } from '../interfaces/user.interface';
import {IUserDBSchema, userDBModel} from './user.db.model';
import { UserState } from './userstate.model';
import {BaseModel} from '../../commons/base/base.model';

@injectable()
export class User extends BaseModel implements IUser {

    @autoserialize
    public id: string;

    @autoserialize
    public email: string;

    @autoserialize
    public firstName: string;

    @autoserialize
    public lastName: string;

    @autoserialize
    public userState: UserState;

    @autoserialize
    public createdOn: string;

    @autoserialize
    public modifiedOn: string;

    public static createFromDB(userModel: IUserDBSchema) {
        return new User(userModel.email,
            userModel.firstName,
            userModel.lastName,
            userModel.userState,
            userModel.modifiedOn,
            userModel.createdOn,
            userModel.id);
    }

    public toDBmodel(): IUserDBSchema {
        let userdb: IUserDBSchema = new userDBModel({
            email: this.email,
            firstName: this.firstName,
            id: this.id,
            lastName: this.lastName,
            userState: this.userState,

        });

        return userdb;
    }

    constructor(email, firstname, lastname, userState, modifiedOn?, createdOn?, id?) {
        super();
        this.id = id;
        this.email = email;
        this.firstName = firstname;
        this.lastName = lastname;
        this.userState = userState;
        this.modifiedOn = modifiedOn;
        this.createdOn = createdOn;
    }
}
