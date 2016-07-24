'use strict';

let gulp = require('gulp');
let path = require('path');
let $ = require('gulp-load-plugins')({
            pattern: ['gulp-*', 'q', 'run-sequence', 'del']
        });
let environment = require('./lib/environment.js');
let argv = require('yargs').argv;

let Server = require('karma').Server;

// Mocha spec
function mochaTests() {
    let reporter = environment.get('reporter', 'progress');

    process.env.NODE_ENV = process.env.NODE_ENV || 'testing';

    let spec;

    if (argv.spec) {
        spec = 'dist/modules/' + argv.spec;
    } else {
        spec = 'dist/**/spec/**/*.js';
    }

    return gulp.src(['gulp/lib/testing/database.js', spec], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe($.mocha({reporter: reporter, grep: argv.grep }))
        .pipe(gulp.dest('coverage'));
}
gulp.task('pureMochaTests', false, [], mochaTests);
gulp.task('buildThenMochaTests', false, ['build'], mochaTests);

// Code coverage report
gulp.task('testCoverage', 'Generate a test coverage report (for mocha spec only)', () =>
    $.runSequence(['build', 'cleanCoverage'], 'copyNonTs', () =>
        gulp.src('dist/**/*.js')
            .pipe($.istanbul())
            .pipe($.istanbul.hookRequire())
            .on('finish', function () {
                gulp.src('dist/**/spec/**/*.js')
                    .pipe($.mocha({reporter: 'spec'}))
                    .pipe($.istanbul.writeReports({
                            dir: './coverage',
                            reporters: ['lcov'],
                            reportOpts: {dir: './coverage'}
                        })
                    );
            })
    )
);

// Cleans the coverage folder
gulp.task('cleanCoverage', false, () => $.del(['coverage']));

// Main test tasks
gulp.task('build+test', 'Build, then run unit spec (once)', ['buildThenMochaTests']);
gulp.task('test', 'Run unit spec (once)', ['pureMochaTests']);
