var gulp = require('gulp');
var config = require('../config');
var paths = config.paths;
var pkg = require('../../package.json');

var $ = require('gulp-load-plugins')();
var sass = require('gulp-ruby-sass');
var addHeader = $.header(config.banner, { pkg : pkg });

gulp.task('sass', function() {
  return sass(paths.sass + '/reasyui.scss', {
      sourcemap: true
    })
    .on('error', function(err) {
      console.error('Error', err.message);
    })
    .pipe($.sourcemaps.write('./', {
      includeContent: false,
      sourceRoot: '/source'
    }))

    .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('styles', ['sass'], function() {
  var autoprefixerCore = require('autoprefixer-core')({
    browsers: [
      'Android 2.3',
      'Android >= 2.3',
      'Chrome >= 20',
      'Firefox >= 24', // Firefox 24 is the latest ESR 
      'iOS >= 6',
      'Opera >= 12',
      'Safari >= 6'
    ]
  });

  var distPaths = paths.dist + '/css';

  return gulp.src(paths.dist + '/css/reasyui.css')

    // CSS 后处理，现在只进行 autoprefixer 
    .pipe($.postcss([autoprefixerCore]))
    .pipe(addHeader)
    .pipe(gulp.dest(distPaths))

    // Mini CSS support to ie7
    .pipe($.minifyCss({
      compatibility: 'ie7'
    }))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(distPaths));
});
