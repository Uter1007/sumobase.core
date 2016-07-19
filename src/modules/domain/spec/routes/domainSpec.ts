import {mochaAsync} from '../../../../commons/testing/mocha/asyncAwait';

import * as request from 'supertest';
import app from './../../../../app';

describe('Domain Route Tests', () => {

    it('menu - should get 200 response', mochaAsync(async () => {
        await request(app)
            .get('/api/domain/menu')
            .expect(200);
    }));
});
