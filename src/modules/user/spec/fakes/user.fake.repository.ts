import {IUserDBSchema} from '../../models/user.db.model';
import {IUserRepository} from '../../interfaces/user.repository.interface';
import {injectable} from 'inversify';

@injectable()
export class UserFakeRepository implements IUserRepository {

    private _testuser: IUserDBSchema;

    public setTestUser(testuser: IUserDBSchema) {
        this._testuser = testuser;
    }

    public create: ((item: IUserDBSchema) => Promise<any>) = (item: IUserDBSchema) =>  {
        return Promise.resolve(this._testuser);
    }

    public retrieveAll: (() => Promise<any[]>) = () => {
        return Promise.resolve([this._testuser]);
    }

    public findOne: ((query: any) => Promise<any>) = (query: any) => {
        return Promise.resolve(this._testuser);
    }

    public find: ((query: any) => Promise<any[]> ) = (query: any) => {
        return Promise.resolve([this._testuser]);
    }

    public update: ((_id: string, item: IUserDBSchema) => Promise<boolean>) = (_id: string, item: IUserDBSchema) => {
        return Promise.resolve(true);
    }

    public delete: ((_id: string) => Promise<boolean>) = (_id: string) => {
        return Promise.resolve(true);
    }

    public findById: ((_id: string) => Promise<any>) = (_id: string) => {
        return Promise.resolve(this._testuser);
    }

}

