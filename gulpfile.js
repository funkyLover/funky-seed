var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();
var webpack = require('webpack-stream');
var server = require('webpack-dev-server');
var webpack = require('webpack');

var sass = require('gulp-ruby-sass');

var webpack_config_dev = require('./webpack.config.dev');

// way to replace the file url in env(development & production)
var fileUrl = '';

gulp.task('clean', function() {
  return del(['build/*']);
});

gulp.task('js', function() {
  return gulp.src('src/**/*.js')
        .pipe($.changed('build'))
        // .pipe($.babel({
        //   presets: ['es2015', 'react']
        // }))
        .pipe($.eslint({config: 'eslint.config.json'}))
        .pipe($.eslint.format())
        .pipe(gulp.dest('build'));
});

gulp.task('css', function() {
  return sass('src/**/*.scss')
        .pipe($.changed('build'))
        .on('error', sass.logError)
        .pipe($.replace('@@FILEURL', fileUrl))
        .pipe(gulp.dest('build'));
});

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
        .pipe($.changed('build'))
        .pipe($.replace('@@FILEURL'), fileUrl)
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['clean'], function() {
  gulp.start('html', 'js', 'css');
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.scss', ['css']);
  gulp.watch('src/**/*.js', ['js']);
});

gulp.task('default', ['clean', 'js', 'css', 'html', 'watch'], function() {
  var app = require('./devServer');
  var port = 3000;
  app.listen(port, function(error) {
    if (error) {
      console.error(error)
    } else {
      console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
  });
});







