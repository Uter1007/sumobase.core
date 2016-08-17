import {IUserDBSchema} from '../../models/user.db.model';

export class UserFakeRepository {

    private _testuser: IUserDBSchema;

    public setTestUser(testuser: IUserDBSchema) {
        this._testuser = testuser;
    }

    public create: ((item: IUserDBSchema) => Promise<any>) = (item: IUserDBSchema) =>  {
        
    }

    public retrieveAll: (() => Promise<any[]>) = () => {

    }

    public findOne: ((query: any) => Promise<any>) = (query: any) => {

    }

    public find: ((query: any) => Promise<any[]> ) = (query: any) => {

    }

    public update: ((_id: string, item: IUserDBSchema) => Promise<boolean>) = (_id: string, item: IUserDBSchema) => {

    }

    public delete: ((_id: string) => Promise<boolean>) = (_id: string) => {

    }

    public findById: ((_id: string) => Promise<any>) = (_id: string) => {

    }

}

