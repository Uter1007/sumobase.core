import {IUserDBSchema, userDBModel} from '../models/user.db.model';
import {User} from '../models/user.model';
import { injectable } from 'inversify';
import {IUser} from '../interfaces/user.interface';

@injectable()
export class UserMapper {

    public toDBmodel(model: IUser): IUserDBSchema {
        let userdb: IUserDBSchema = new userDBModel({
            createdOn: model.createdOn,
            email: model.email,
            firstName: model.firstName,
            id: model.id,
            lastName: model.lastName,
            state: model.state,
        });

        return userdb;
    }

    public toUser(userModel: IUserDBSchema): User {
        return new User(userModel.email,
            userModel.firstName,
            userModel.lastName,
            userModel.state,
            userModel.modifiedOn,
            userModel.createdOn,
            userModel.id);
    }
}

export default UserMapper;
