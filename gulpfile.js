var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var stylus = require('gulp-stylus');
var shell = require('gulp-shell');

gulp.task('coffee', function() {
  return gulp.src('./src/coffee/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./build/js'))
});

gulp.task('stylus', function() {
  return gulp.src('./src/stylus/*.styl')
      .pipe(stylus())
      .pipe(gulp.dest('./build/css'))
});

gulp.task('react-build', function() {
  gulp.src('').pipe(shell(['webpack']));
});

gulp.task('build', ['coffee', 'stylus', 'react-build']);
