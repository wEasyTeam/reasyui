/*global -$ */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var requireDir = require('require-dir');

// All gulp task are define in dir './gulp'
// 注意顺序，此处可以理解为在 gulpfile.js 中加载 './gulp' 文件夹或子文件夹下的 js文件
// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });

// 删除 gulp-cache 缓存的数据
gulp.task('clear', function (done) {
  return $.cache.clearAll(done);
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

