import * as request from 'supertest';
import app from './../../../../app';

describe('Mocha: Example routes @IntegrationTests', () => {

    it('should get 200 response from healthCheck @IntegrationTest', done => {
        request(app)
            .get('/')
            .expect(200, done);
    });

   /* it('should get 404 from unknown route', done => {
        superRequest(app)
            .get('/asodkoasd9923942ik3koadskoaksda9isd')
            .expect(404, done);
    });*/

});
