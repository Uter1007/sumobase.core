import { injectable } from 'inversify';

/* tslint:disable */
let bcrypt = require('bcrypt');
/* tslint:enable */

@injectable()
export class PasswordService {

    public async hash(data: any, rounds: number): Promise<string> {
        return new Promise<string>( (resolve: any, reject: any) => {
            bcrypt.hash(data, rounds, function (err, hash) {
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

export default PasswordService;
