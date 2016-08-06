import { injectable } from 'inversify';

/* tslint:disable */
const config = require('../../../config/config.json');
let fs = require('fs');
let path = require('path');
/* tslint:enable */

import * as lodash from 'lodash';

@injectable()
class ConfigLoader {

    private static mergedConfig;

    public static getConfig() {
        if (!this.mergedConfig) {
            this.initConfig();
        }
        return this.mergedConfig;
    }

    private static initConfig() {
        console.log('initConfig');
        const filePath = path.join(process.cwd(), 'config/config.local.json');
        this.mergedConfig = lodash.merge(config, (fs.existsSync(filePath)) && require(filePath) || {});
    }

}

export default ConfigLoader;
