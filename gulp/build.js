'use strict';

//Dependencies
let gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'del', 'run-sequence', 'webpack', 'gutil']
    }),
    config = require('./config.json'),
    tsConfig = require('../tsconfig.json');

/**
 * Create typescript project build reference for incremental compilation under watch tasks
 *
 * @link https://github.com/ivogabe/gulp-typescript
 */
var hasError = false;

var tsProject = $.typescript.createProject('tsconfig.json', {
    // Override package version of typescript to use latest compiler version
    typescript: require('typescript')
});

/**
 * Cleans the dist folder
 */
gulp.task('clean', false, () => $.del(['dist']));


/**
 * Precopies all non-ts files into the dist folder
 */
gulp.task('copyNonTs', false, () => {
    return gulp.src(['src/.env', 'src/**/*', '!src/**/*.ts'])
        .pipe(gulp.dest('dist'));
});

/**
 * Lints typescript code
 */
gulp.task('lint', 'Runs a typescript linter on the application code', () =>
    gulp.src(config.tsLinter.sources)
        .pipe($.tslint(config.tsLinter.options))
        .pipe($.tslint.report(config.tsLinter.reporter))
);

/**
 * Compiles typescript app into js - added Sourcempas support in compile step
 */
gulp.task('compile', false, () => {


    var tsResult = gulp.src(tsConfig.files)
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProject, undefined, $.typescript.reporter.longReporter()))
        .on('error', function() { hasError = true; });

    return tsResult.js
        .pipe($.sourcemaps.write('./src/ts'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', 'Builds and lints the server app (compiles & copies)', (callback) => {
    $.runSequence('lintAndBuildServer', callback);
});

/**
 * Build the server app
 */
gulp.task('lintAndBuildServer', 'Builds and lints the server app (compiles & copies)', (callback) => {
        $.runSequence(
            'lint',
            'buildServer',
            function (err) {
                if (err || hasError) {
                    var exitCode = 2;
                    console.log('[ERROR] gulp build task failed', err);
                    console.log('[FAIL] gulp build task failed - exiting with code ' + exitCode);
                    return process.exit(exitCode);
                }
                else {
                    return callback();
                }
            });
    }
);

gulp.task('buildServer', 'Builds the server app (compiles & copies)', (callback) => {
        $.runSequence(
            'clean',
            'compile',
            function (err) {
                if (err || hasError) {
                    var exitCode = 2;
                    console.log('[ERROR] gulp build task failed', err);
                    console.log('[FAIL] gulp build task failed - exiting with code ' + exitCode);
                    return process.exit(exitCode);
                }
                else {
                    return callback();
                }
            });
    }
);
