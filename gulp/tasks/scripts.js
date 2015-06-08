var gulp = require('gulp');
var config = require('../config');
var paths = config.paths;
var $ = require('gulp-load-plugins')();
var pkg = require('../../package.json');
var addHeader = $.header(config.banner, { pkg : pkg });

gulp.task('js', function() {
  var distPath = paths.dist + '/js';
  var modules = [paths.js + '/core.js', paths.js + '/dialog.js',
      paths.js + '/input.js' , paths.js + '/massage.js',
      paths.js + '/select.js', paths.js + '/textboxs.js',
      paths.js + '/tip.js', paths.js + '/validate.js', paths.js + '/lang/*.js'];

  return gulp.src(modules)

    // Concat js
    .pipe($.concat('reasyui.js'))
    .pipe(addHeader)
    .pipe(gulp.dest(distPath))

    // Mini js
    .pipe($.uglify())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(distPath));
});
