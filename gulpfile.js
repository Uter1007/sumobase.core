let gulp = require('gulp-help')(require('gulp')),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'run-sequence']
    });

require('require-dir')('./gulp');

/**
 * default task
 */
gulp.task('default', 'Default task: swaggerBuildServe', ['swaggerBuildServe']);

/**
 * Frontend task, only start the server without rebuild and swagger..
 */
gulp.task('fe', 'Frontend task', ['swaggerBuildServeHR']);
gulp.task('feonly', 'Frontend task', ['serveHR']);

gulp.task('be', 'Backend task', ['swaggerBuildServeWatch']);
gulp.task('beonly', 'Backend task', [], (cb) => {
    $.runSequence('lintAndBuildServer', 'copyNonTs', 'serve', 'watch', cb);
});

/**
 * Combined watch and server
 */
gulp.task('swaggerBuildServeWatch',
          'Launch the server on development mode, autoreloads it when there are code changes, ' +
          'plus registers cumulative watch task', [], (cb) => {
    $.runSequence('swagger-ui', 'build', 'serve', 'watch', cb);
}, {
    options: {
        'port': 'The port # the server should listen to. ' +
        'Defaults to value specified in .env file under PORT, or 3000 if .env not present'
    }
});

/**
 * build and serve
 */
gulp.task('swaggerBuildServe', 'Launch the server on development mode, ' +
          'autoreloads it when there are code changes', [], (cb) => {
    $.runSequence('swagger-ui', 'build', 'serve', cb);
}, {
    options: {
        'port': 'The port # the server should listen to. ' +
        'Defaults to value specified in .env file under PORT, or 3000 if .env not present'
    }
});

/**
 * build and serve with hotreloading of FE code
 */
gulp.task('swaggerBuildServeHR', 'Launch the server in HR mode', [], (cb) => {
    $.runSequence('swagger-ui', 'lintAndBuildServer', 'copyNonTs', 'serveHR', cb);
}, {
    options: {
        'port': 'The port # the server should listen to. ' +
        'Defaults to value specified in .env file under PORT, or 3000 if .env not present'
    }
});
