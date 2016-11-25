export interface IBaseRepository {
    create(item: any): Promise<any>;
    retrieveAll(): Promise<any[]>;
    findOne(query: any): Promise<any>;
    find(query: any): Promise<any[]>;
    update(_id: string, item: any): Promise<boolean>;
    delete(_id: string): Promise<boolean>;
    findById(_id: string): Promise<any>;
}

