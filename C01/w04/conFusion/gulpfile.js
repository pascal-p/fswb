'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

gulp.task('sass', function () {
  return gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./css/*.scss', ['sass']);
});

gulp.task('browser-sync', function () {
  let files = [
    './*.html',
    './css/*.css',
    './img/*.{png,jpg,gif}',
    './js/*.js'
  ];

  browserSync.init(files, {
    server: {
      baseDir: "./dist"
    }
  });

});

// Clean
gulp.task('clean', function() {
  return del(['dist']);
});

// Copy fonts
gulp.task('copyfonts', function() {
  gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
});

// Images
gulp.task('imagemin', function() {
  return gulp.src('img/*.{png,jpg,gif}')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'));
});

// Minify
gulp.task('usemin', function() {
  return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file) {
      return stream
        .pipe(usemin({
          css: [ rev() ],
          html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
          js: [ uglify(), rev() ],
          inlinejs: [ uglify() ],
          inlinecss: [ cleanCss(), 'concat' ]
        }))
    }))
    .pipe(gulp.dest('dist/'));
});


//
// Default task
//
// src: https://www.coursera.org/learn/bootstrap-4/discussions/weeks/4/threads/2s02zJ2kEems8QqW3KsVKg
//
gulp.task('default', gulp.series('browser-sync', function() {
  gulp.start('sass:watch');
}));


// ref. https://www.coursera.org/learn/bootstrap-4/discussions/weeks/4/threads/VRBjrKenT8-QY6ynp7_Prg
gulp.task('copyfonts',
          async function() {
            gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
              .pipe(gulp.dest('./dist/fonts'));
          });

gulp.task('build',
          gulp.series('clean',
                      gulp.parallel('copyfonts','imagemin', 'usemin')));
