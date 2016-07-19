'use strict';

let gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'run-sequence']
    });

gulp.task('tdd', 'Runs unit spec when file changes are detected',
          () => gulp.watch(['dist/**/*.js', '!dist/public/**/*.js'], ['test']));

/**
 * Watches for ts files
 */
gulp.task('tsWatcher', false,
          () => gulp.watch(['src/**/*.ts', 'typings/**/*.ts', 'gulp/**/*.ts'], ['lint', 'compile']));

/**
 * Watches for non-ts files
 */
gulp.task('nonTsWatcher', false,
          () => gulp.watch(['src/.env', 'src/**/*', '!src/**/*.ts'], ['copyNonTs']));

/**
 * Watches for swagger spec files
 */
gulp.task('swaggerWatcher', false,
          () => gulp.watch(['swagger/**/*'], ['swagger-ui']));

/**
 * Combined watcher
 */
gulp.task('watch', 'Master watch task, adds cumulative watches (test/lint)',
          ['tdd', 'tsWatcher', 'nonTsWatcher', 'swaggerWatcher'], () => {});
