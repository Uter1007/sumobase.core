let gulp = require('gulp-help')(require('gulp')),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'run-sequence']
    });

/*
 * Load all JavaScript files from the "gulp" directory to load all gulp tasks
 */
require('require-dir')('./gulp');
