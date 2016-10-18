var gulp = require('gulp');
var argv = require('yargs').argv;
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var tslint = require("gulp-tslint");
var nodeInspector = require('gulp-node-inspector');
var runSequence = require('run-sequence');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var del = require('del');
var apidoc = require('gulp-apidoc');
var istanbul = require('gulp-istanbul');

var tsProject = tsc.createProject('tsconfig.json');

nodemonConfiguration = {
    script: './dist/app.js',
    ext: 'ts', // js reload when any of these file extensions changes -> watch will trigger compileing of ts to js,
    watch: ['dist'], //
    exec: 'node',
    env: {
        'NODE_ENV': 'development'
    }
};

gulp.task("clean", function(callback) {
    return del(['dist/**'], callback);
});

gulp.task("lint", function() {
    return gulp.src([
        "src/**/**.ts"
    ])
    .pipe(tslint({
        formatter: "verbose"
    }))
    .pipe(tslint.report());
});

gulp.task('ts-compile', function() {

    var tsProject = tsc.createProject('tsconfig.json');

    return gulp.src([
        "src/**/**.ts",
        "typings/index.d.ts",
        "node_modules/inversify-dts/inversify-binding-decorators/inversify-binding-decorators.d.ts",
        "node_modules/inversify-dts/inversify-express-utils/inversify-express-utils.d.ts",
        "node_modules/inversify-dts/inversify-logger-middleware/inversify-logger-middleware.d.ts",
        "node_modules/inversify-dts/inversify/inversify.d.ts"
    ])
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(sourcemaps.write('./src/ts'))
    .pipe(gulp.dest('dist'));
});


gulp.task('node-inspector', function() {

    gulp.src([])
        .pipe(nodeInspector({
            debugPort: 5858,
            webHost: '0.0.0.0',
            webPort: 8080,
            saveLiveEdit: false,
            preload: true,
            inject: true,
            hidden: [],
            stackTraceLimit: 50,
            sslKey: '',
            sslCert: ''
        }));
});

gulp.task('serve', function () {
    var cfg = JSON.parse(JSON.stringify(nodemonConfiguration));

    cfg.exec = 'node';

    nodemon(cfg).on('restart', function () {
        console.log('restarted!')
    });
});

gulp.task('serve-debug', function () {
    var cfg = JSON.parse(JSON.stringify(nodemonConfiguration));

    cfg.exec = 'node --debug';

    nodemon(cfg).on('restart', function () {
        console.log('restarted!')
    });
});

gulp.task('watch', false,
    function () {
        gulp.watch('src/**/**.ts', ['lint', 'compile']);
    }
);

gulp.task('pre-test', function () {
    if(!argv.brief) {
        return gulp.src(['dist/**/*.js'])
        // Covering files
            .pipe(istanbul())
            .pipe(istanbul.hookRequire());
    }
});

gulp.task('test', ['pre-test'], function() {
    var test = gulp.src(['dist/**/spec/**/*.js'], {read: false})
        .pipe(mocha({}));
    if(!argv.brief) {
        return test.pipe(istanbul.writeReports());
    } else {
        return test;
    }
});

gulp.task('copyConfigurations', function() {
    gulp.src('src/**/*.json')
        .pipe(gulp.dest('dist'));

    gulp.src('src/**/*.hbs')
        .pipe(gulp.dest('dist'));

    gulp.src('src/public/**/*.*')
        .pipe(gulp.dest('dist/public'));
});

gulp.task('compile', function(callback) {
    runSequence('clean', 'copyConfigurations', 'ts-compile', callback);
});

gulp.task('default', function() {
    runSequence(
        'compile',
        'serve-debug',
        'node-inspector'
    );
});

gulp.task('prod', function() {
    runSequence(
        'compile',
        'serve'
    );
});


gulp.task('apidoc', function(done) {
    apidoc({
        src: "src/",
        dest: "src/public/documentation/api"
    },done);
});