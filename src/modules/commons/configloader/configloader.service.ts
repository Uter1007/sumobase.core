import { injectable } from 'inversify';

import * as config from '../../../config/config.json';
import * as localConfig from '../../../config/config.local.json';
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
