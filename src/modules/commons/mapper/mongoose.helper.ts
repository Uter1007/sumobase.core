class MongooseMapperHelper {

    public static getObject<T>(object: any): T {
        // mongoose workaround
        let source: any = object;
        if (object.hasOwnProperty('_doc')) {
            source = object._doc;
        }
        return <T>source;
    }
}

export default MongooseMapperHelper;
