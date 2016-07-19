import {BaseRepository} from '../../../commons/base/baseRepository';
import {sessionModel, ISessionModel} from '../models/sessionModel';
import * as Promise from 'bluebird';

export class SessionRepository extends BaseRepository<ISessionModel> {

    constructor() {
        super(sessionModel);
    }

    public findSession: ((userId: string, refreshToken: string) => Promise<any> ) =
        (userId: string, refreshToken: string) => {
        return new Promise( (resolve: any, reject: any) => {
            return sessionModel
                .findOne({ refreshToken: refreshToken, user: this.toObjectId(userId) })
                .populate('user', '-password')
                .exec((err: any, session: any) => {
                    if (err) {
                        return err;
                    }

                    return session;
                })
                .then((result: any) => {
                    return resolve(result);
                }).onReject((error: any) => {
                    return reject(error);
                });
        });
    };
}
