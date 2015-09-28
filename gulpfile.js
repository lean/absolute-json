var gulp = require('gulp'),
 uglify = require('gulp-uglify'),
 jshint = require('gulp-jshint'),
 rename = require("gulp-rename"),
 stylish = require('jshint-stylish');

gulp.task('default', function() {
  gulp.src('./src/absolute-json.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .pipe(uglify({
      preserveComments : "some"
    }))
    .pipe(rename("absolute-json.min.js"))
    .pipe(gulp.dest('./'))
});
