'use strict';

var gulp        = require('gulp');
var connect     = require('gulp-connect');
var browserify  = require('gulp-browserify');
var plumber     = require('gulp-plumber');
var rename      = require('gulp-rename');

gulp.task('webserver', function() {
  connect.server({
    root: ['./build'],
    livereload: true
  });
});

gulp.task('browserify', function() {
  gulp.src('./src/index.js')
    .pipe(plumber())
    .pipe(browserify())
    .pipe(rename('index.js'))
    .pipe(gulp.dest('./build'))
    .pipe(connect.reload());
});

gulp.task('copy', function() {
  gulp.src('./src/index.html')
    .pipe(plumber())
    .pipe(gulp.dest('./build'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('./src/*.js', ['browserify']);
  gulp.watch('./src/index.html', ['copy']);
});

gulp.task('build', ['browserify', 'copy']);
gulp.task('default', ['build', 'webserver', 'watch']);