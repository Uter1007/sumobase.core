var gulp = require('gulp');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var tslint = require("gulp-tslint");
var nodeInspector = require('gulp-node-inspector');
var runSequence = require('run-sequence');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');

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

gulp.task("lint", function() {
    return gulp.src([
        "src/**/**.ts"
    ])
    .pipe(tslint({
        formatter: "verbose"
    }))
    .pipe(tslint.report());
});

gulp.task("compile", function() {
    return gulp.src([
        "src/**/**.ts",
        "typings/index.d.ts",
        "node_modules/inversify-dts/inversify-binding-decorators/inversify-binding-decorators.d.ts",
        "node_modules/inversify-dts/inversify-express-utils/inversify-express-utils.d.ts",
        "node_modules/inversify-dts/inversify-logger-middleware/inversify-logger-middleware.d.ts",
        "node_modules/inversify-dts/inversify/inversify.d.ts"
    ])
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProject))
    .js.pipe(sourcemaps.write('./src/ts'))
       .pipe(gulp.dest('dist'));
});


gulp.task('debug', function() {

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

gulp.task('test', false, function() {
    return gulp.src(['dist/**/spec/**/*.js'], {read: false})
        .pipe(mocha({}));
});


gulp.task('default', function() {
    runSequence(
        'compile',
        'serve',
        'debug'
    );
});