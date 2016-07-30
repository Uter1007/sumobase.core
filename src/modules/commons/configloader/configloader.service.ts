import { injectable } from 'inversify';

const config = require('../../../config/config.json');
const localConfig = require ('../../../config/config.local.json');

import * as lodash from 'lodash';

@injectable()
class ConfigLoader {

    private static mergedConfig;

    constructor() {
    }

    public static getConfig() {
        if(!this.mergedConfig) {
            this.initConfig();
        }
        return this.mergedConfig;
    }

    private static initConfig() {
        console.log('initConfig');
        this.mergedConfig = lodash.merge(config, localConfig);
    }
}

export default ConfigLoader;
