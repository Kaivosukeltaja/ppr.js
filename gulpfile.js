(function() {
  'use strict';

  var gulp = require('gulp'),
    concat = require('gulp-concat'),
    karma = require('karma').Server,
    jscs = require('gulp-jscs'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),

    // Files in correct order
    jsFiles = [
      'src/main.js',
      'src/ppr.config.js',
      'src/library/**/*.js',
      'src/**/!(ppr.js)*',
      'src/ppr.js'
    ];

  // Build
  gulp.task('build', function() {
    gulp.start(['build:dist', 'build:dev']);
  });

  // Build development
  gulp.task('build:dev', ['jscs'], function() {
    gulp.src(jsFiles)
      .pipe(concat('ppr.js'))
      .pipe(gulp.dest('dist'));
  });

  // Build dist
  gulp.task('build:dist', [], function() {
    gulp.src(jsFiles)
      .pipe(uglify({ compress: { drop_console: true }}))
      .pipe(concat('ppr.min.js'))
      .pipe(gulp.dest('dist'));
  });

  // Default
  gulp.task('default', function() {
    gulp.start(['build', 'watch']);
  });

  // JSCS
  gulp.task('jscs', function() {
    gulp.src(['src/**/*.js'])
      .pipe(jscs())
      .pipe(jscs.reporter());
  });

  // Test project
  gulp.task('test', function(done) {
    new karma({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, done).start();
  });

  // Watch and run tests
  gulp.task('test:watch', function(done) {
    new karma({
      configFile: __dirname + '/karma.conf.js',
      singleRun: false
    }, done).start();
  });

  // Watch files and build
  gulp.task('watch', function() {

    watch(['src/**/*.js'], function() {
      gulp.start('build');
    });
  });
})();
