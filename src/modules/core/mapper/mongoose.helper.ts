/*
    Class will help to extract data from Mongoose and will remove unnecessary properties
    like __v, _id .
    we only use id & doc from mongoose

 */
export class MongooseMapperHelper {

    public static getObject<T>(object: any): T {
        // mongoose workaround
        let source: any = object;
        if (object.hasOwnProperty('_doc')) {
            source = object._doc;
            source.id = object.id;
        }

        if (source.hasOwnProperty('_id')) {
            delete source._id;
        }

        if (source.hasOwnProperty('__v')) {
            delete source.__v;
        }

        return <T>source;
    }
}

