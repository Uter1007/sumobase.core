import {DomainRepository} from './domainRepository';
import {BaseService} from '../../../commons/base/baseService';

export class DomainService extends BaseService {

    private _domainRepository: DomainRepository;

    constructor() {
        super();
        this._domainRepository = new DomainRepository();
    }

    public readMenu() {
        try {
            const routeConfiguration = require('../../../config/routeConfiguration.json');
            return routeConfiguration;
        } catch (e) {
            return undefined;
        }
    }
}
