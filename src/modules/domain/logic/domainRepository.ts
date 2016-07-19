import {IDomainModel, domainModel} from '../models/domainModel';
import {BaseRepository} from '../../../commons/base/baseRepository';

export class DomainRepository extends BaseRepository<IDomainModel> {
    constructor() {
        super(domainModel);
    }
}
