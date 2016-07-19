import {BaseController} from '../../../commons/base/baseController';
import {DomainService} from '../logic/domainService';
import {Request, Response} from 'express';

export class DomainController extends BaseController {

    private _domainService: DomainService;

    constructor() {
        super();
        this._domainService = new DomainService();
    }

    public getMenu: ((req: Request, res: Response, next: Function) => void)
    = async (req: Request, res: Response, next: Function) => {
        const menu = this._domainService.readMenu();
        res.send(menu);
    };
}
