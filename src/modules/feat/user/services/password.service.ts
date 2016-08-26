import { injectable } from 'inversify';

/* tslint:disable */
let bcrypt = require('bcrypt');
/* tslint:enable */

@injectable()
export class PasswordService {

    private _rounds: number;

    constructor(rounds: number) {
        this._rounds = rounds;
    }

    public async hash(data: any): Promise<string> {
        return new Promise<string>( (resolve: any, reject: any) => {
            bcrypt.hash(data, this._rounds, function (err, hash) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(hash);
                }
            });
        });
    }

    public async compare(data: any, encrypted: string): Promise<boolean> {
        return new Promise<boolean>( (resolve: any, reject: any) => {
            bcrypt.compare(data, encrypted, function(err, result) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }

}
