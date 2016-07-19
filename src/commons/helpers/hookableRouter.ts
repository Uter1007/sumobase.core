import {Router} from 'express';

export class HookableRouter {

    private router: Router;
    private beforeHandlers: any[];
    private afterHandlers: any[];

    constructor(beforeHandlers?: any, afterHandlers?: any) {
        this.router = Router();
        this.beforeHandlers = beforeHandlers ? beforeHandlers : [];
        this.afterHandlers = afterHandlers ? afterHandlers : [];

        const routerActions = ['get', 'post', 'put', 'delete'];
        routerActions.forEach((routerAction) => {
            this[routerAction] = (path: string, ...handler: any[]) => {
                this.router[routerAction](
                    path,
                    this.beforeHandlers,
                    ...handler,
                    this.afterHandlers
                );
            };
        });
    }
    public getHookedRouter() {
        return this.router;
    }
}
