import {IActionEmailRepository} from '../../interfaces/action.email.repository.interface';
import {IActivityEmailDBSchema} from '../../models/action.email.activity.db.model';
import {injectable} from 'inversify';

@injectable()
export class ActionEmailFakeRepository implements IActionEmailRepository {

    private _testactionEmail: IActivityEmailDBSchema;

    public setTestUser(testactionEmail: IActivityEmailDBSchema) {
        this._testactionEmail = testactionEmail;
    }

    public create: ((item: IActivityEmailDBSchema) => Promise<any>) = (item: IActivityEmailDBSchema) =>  {
        return Promise.resolve(this._testactionEmail);
    }

    public retrieveAll: (() => Promise<any[]>) = () => {
        return Promise.resolve([this._testactionEmail]);
    }

    public findOne: ((query: any) => Promise<any>) = (query: any) => {
        return Promise.resolve(this._testactionEmail);
    }

    public find: ((query: any) => Promise<any[]> ) = (query: any) => {
        return Promise.resolve([this._testactionEmail]);
    }

    public update: ((_id: string, item: IActivityEmailDBSchema) => Promise<boolean>)
    = (_id: string, item: IActivityEmailDBSchema) => {
        return Promise.resolve(true);
    }

    public delete: ((_id: string) => Promise<boolean>) = (_id: string) => {
        return Promise.resolve(true);
    }

    public findById: ((_id: string) => Promise<any>) = (_id: string) => {
        return Promise.resolve(this._testactionEmail);
    }

}


