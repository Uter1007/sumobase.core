import {IUserDBSchema} from '../../models/user.db.model';
import {IUserRepository} from '../../interfaces/user.repository.interface';
import {injectable} from 'inversify';
import * as moment from 'moment';
import kernel from '../helper/user.kernel.test.helper';
import {PasswordService} from '../../services/password.service';

@injectable()
export class UserFakeRepository implements IUserRepository {

    private _testuser: IUserDBSchema;

    constructor() {

        this._testuser = <any> {
            createdOn: moment().utc(),
            email : 'christoph.ott@lean-coders.at',
            firstName : 'christoph',
            id : '57af7a9d77257f6c0a3af0b7',
            lastName: 'ott',
            modifiedOn : moment().utc(),
            state : 'active',
        };
    }

    public create: ((item: IUserDBSchema) => Promise<any>) = (item: IUserDBSchema) =>  {
        return Promise.resolve(this._testuser);
    }

    public retrieveAll: (() => Promise<any[]>) = () => {
        return Promise.resolve([this._testuser]);
    }

    public findOne: ((query: any) => Promise<any>) = (query: any) => {
        if (query.email && query.email !== this._testuser.email) {
            return Promise.resolve(undefined);
        }
        let pwService = kernel.get<PasswordService>(PasswordService.name);
        return pwService.hash('123appTest$!').then((result) => {
            this._testuser.password = result;
            return Promise.resolve(this._testuser);
        });
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

