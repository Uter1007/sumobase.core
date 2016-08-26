import * as mongoose from 'mongoose';

export class BaseModel {

    public getDBObjectId(id: string) {
        return mongoose.Types.ObjectId.createFromHexString(id);
    }
}
