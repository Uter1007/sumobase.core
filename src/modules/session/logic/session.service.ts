// import {UserRepository} from '../../user/logic/userRepository';
import {SessionRepository} from '../repository/session.repository';
import {ISessionModel} from '../models/session.model';
import {LogLevel} from '../../../commons/logger/log.model';
import {BaseService} from '../../../commons/base/base.service';

export class SessionService extends BaseService {

    private _sessionRepository: SessionRepository;

    constructor() {
        super();
        this._sessionRepository = new SessionRepository();
    }

    public createAsync: ((sessionModel: ISessionModel) => Promise<ISessionModel>) =
        async (sessionModel: ISessionModel) => {
        try {
            return await this._sessionRepository.create(sessionModel);
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    };

    public findSessionAsync: ((userId: string, refreshToken: string) => Promise<ISessionModel>) =
        async (userId: string, refreshToken: string) => {
        try {
            return await this._sessionRepository.findSession(userId, refreshToken);
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    };

    public removeSession: ((sessionId: string) => Promise<any>)=
        async (sessionId: string) => {
        try {
            return await this._sessionRepository.delete(sessionId);
        } catch (err) {
            this.log(LogLevel.ERROR, err);
            return err;
        }
    };
}
