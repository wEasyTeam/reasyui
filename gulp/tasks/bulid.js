'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var paths = require('../config').paths;

gulp.task('jshint', function () {
  return gulp.src(paths.js + '/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});


gulp.task('images', function () {
  return gulp.src(paths.assets + '/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest(paths.dist + '/img'));
});

gulp.task('fonts', function () {
  return gulp.src(paths.assets + 'fonts/*')
    .pipe(gulp.dest(paths.tmp + '/fonts'))
    .pipe(gulp.dest(paths.dist + '/fonts'));
});

// 删除开发目录
gulp.task('clean', require('del').bind(null, [paths.tmp, paths.dist]));

gulp.task('build', ['images', 'fonts', 'styles', 'js'], function () {

  return gulp.src(paths.dist + '/**/*')
    .pipe($.size({title: 'build', gzip: true}));
});

