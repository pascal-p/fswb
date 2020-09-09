'use strict';

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync');

gulp.task('sass', function () {
  return gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./css/*.scss', ['sass']);
});

gulp.task('browser-sync', function () {
  var files = [
    './*.html',
    './css/*.css',
    './img/*.{png,jpg,gif}',
    './js/*.js'
  ];

  browserSync.init(files, {
    server: {
      baseDir: "./"
    }
  });

});

// Default task


// src: https://www.coursera.org/learn/bootstrap-4/discussions/weeks/4/threads/2s02zJ2kEems8QqW3KsVKg

// gulp.task('default', ['browser-sync'], function() {
//   gulp.start('sass:watch');
// });

// OK
gulp.task('default', gulp.series('browser-sync', function() {
  gulp.start('sass:watch');
}));
