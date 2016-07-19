'use strict';

var gulp = require('gulp');
var prompt = require('gulp-prompt');
var replace = require('gulp-replace');

// configuration file skeleton with placeholders
var skeletonFile = 'skeleton/config/env/config.ts';

var destinationDirectory = 'src/config/env';

var injections = {};

gulp.task('init-config-prompt', function() {
    return gulp.src(skeletonFile).pipe(prompt.prompt([{
        type: 'input',
        name: 'db.uri',
        message: 'Database URI:'
    }, {
        type: 'input',
        name: 'db.user',
        message: 'Database User:'
    }, {
        type: 'input',
        name: 'db.pass',
        message: 'Database Password:'
    }, {
        type: 'input',
        name: 'fixtureDb.uri',
        message: 'Test/Fixture Database URI:'
    }, {
        type: 'input',
        name: 'fixtureDb.user',
        message: 'Test/Fixture Database User:'
    }, {
        type: 'input',
        name: 'fixtureDb.pass',
        message: 'Test/Fixture Database Password:'
    }, {
        type: 'input',
        name: 'token.secret',
        message: 'Authentication Token Secret:'
    }, {
        type: 'input',
        name: 'mail.domain',
        message: 'Mail Domain:'
    }, {
        type: 'input',
        name: 'mail.apiKey',
        message: 'Mail API Key:'
    }], function(res) {
        injections = res;
    }));
});

gulp.task('init-config', ['init-config-prompt'], function() {
    var src = gulp.src(skeletonFile);
    var keys = Object.keys(injections);
    var previous = src;
    keys.forEach(function(key) {
        var injection = injections[key];
        var pattern = new RegExp('{{ *' + key + ' *}}', 'g');
        previous = previous.pipe(replace(pattern, injection));
    });
    return previous.pipe(gulp.dest(destinationDirectory));
});

gulp.task('init', ['init-config']);
