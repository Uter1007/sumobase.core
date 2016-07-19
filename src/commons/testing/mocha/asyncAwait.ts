'use strict';

/**
 * Async/Await for Mocha
 */

export const mochaAsync = (fn) => {
    return async (done) => {
        try {
            await fn();
            done();
        } catch (err) {
            done(err);
        }
    };
};
