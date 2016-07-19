'use strict';

var gulp = require('gulp');
var es = require('event-stream');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var header = require('gulp-header');
var order = require('gulp-order');
var jshint = require('gulp-jshint');
var pkg = require('../node_modules/swagger-ui/package.json');

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

/**
 * Cleans up swagger-ui/dist folder
 */
gulp.task('swagger-ui:clean', function() {
  return gulp
    .src('./swagger-ui/dist', {read: false})
    .pipe(clean({force: true}))
    .on('error', log);
});

/**
 * JShint all *.js files
 */
gulp.task('swagger-ui:lint', function () {
  return gulp.src('./swagger-ui/src/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Build a distribution
 */
gulp.task('swagger-ui:dist', ['swagger-ui:clean', 'swagger-ui:lint'], _dist);
function _dist() {
  return es.merge(
    gulp.src([
        './node_modules/swagger-ui/src/main/javascript/**/*.js',
        './node_modules/swagger-client/browser/swagger-client.js'
      ]),
      gulp
        .src(['./node_modules/swagger-ui/src/main/template/**/*'])
        .pipe(handlebars())
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
          namespace: 'Handlebars.templates',
          noRedeclare: true, // Avoid duplicate declarations
        }))
        .on('error', log)
    )
    .pipe(order(['scripts.js', 'templates.js']))
    .pipe(concat('swagger-ui.js'))
    .pipe(wrap('(function(){<%= contents %>}).call(this);'))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('./swagger-ui/dist'))
    .pipe(uglify())
    .on('error', log)
    .pipe(rename({extname: '.min.js'}))
    .on('error', log)
    .pipe(gulp.dest('./swagger-ui/dist'))
    .pipe(connect.reload());
}
gulp.task('swagger-ui:dev-dist', ['swagger-ui:lint', 'swagger-ui:dev-copy'], _dist);

/**
 * Processes less files into CSS files
 */
gulp.task('swagger-ui:less', ['swagger-ui:clean'], _less);
function _less() {
  return gulp
    .src([
      './node_modules/swagger-ui/src/main/less/screen.less',
      './node_modules/swagger-ui/src/main/less/print.less',
      './node_modules/swagger-ui/src/main/less/reset.less',
      './node_modules/swagger-ui/src/main/less/style.less'
    ])
    .pipe(less({
      paths: ['./node_modules/swagger-ui']
    }))
    .on('error', log)
    .pipe(gulp.dest('./swagger-ui/dist/css/'))
    .pipe(connect.reload());
}
gulp.task('swagger-ui:dev-less', _less);

/**
 * Copy lib and html folders
 */
gulp.task('swagger-ui:copy', ['swagger-ui:less'], _copy);
function _copy() {
  // copy JavaScript files inside lib folder
  gulp
    .src(['./node_modules/swagger-ui/lib/**/*.{js,map}'])
    .pipe(gulp.dest('./swagger-ui/dist/lib'))
    .on('error', log);

  // copy `lang` for translations
  gulp
    .src(['./node_modules/swagger-ui/lang/**/*.js'])
    .pipe(gulp.dest('./swagger-ui/dist/lang'))
    .on('error', log);

  // copy all files inside html folder
  gulp
    .src(['./node_modules/swagger-ui/src/main/html/**/*', './swagger-ui/src/html/**/*'])
    .pipe(gulp.dest('./swagger-ui/dist'))
    .on('error', log);


}
gulp.task('swagger-ui:dev-copy', ['swagger-ui:dev-less', 'swagger-ui:copy-local-specs'], _copy);

gulp.task('swagger-ui:copy-local-specs', function () {
  // copy the test specs
  return gulp
    .src(['./swagger-ui/specs/**/*'])
    .pipe(gulp.dest('./swagger-ui/dist/specs'))
    .on('error', log);
});

/**
 * Watch for changes and recompile
 */
gulp.task('swagger-ui:watch', ['swagger-ui:copy-local-specs'], function() {
  return watch([
    './swagger-ui/src/**/*.{js,less,handlebars}',
    './swagger-ui/src/html/*.html',
    './swagger-ui/specs/**/*.{json,yaml}'
    ],
    function() {
      gulp.start('swagger-ui:dev-dist');
    });
});

/**
 * Live reload web server of `swagger-ui/dist`
 */
gulp.task('swagger-ui:connect', function() {
  connect.server({
    root: 'swagger-ui/dist',
    livereload: true
  });
});

function log(error) {
  console.error(error.toString && error.toString());
}

// default task for swagger-ui:
gulp.task('swagger-ui', ['swagger-ui:dist', 'swagger-ui:copy']);

gulp.task('swagger-ui:serve', ['swagger-ui:connect', 'swagger-ui:watch']);
gulp.task('swagger-ui:dev', ['swagger-ui:default'], function () {
  gulp.start('swagger-ui:serve');
});
