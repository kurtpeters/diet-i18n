var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
    return gulp.src('./src/diet-i18n.js')
    .pipe(concat('diet-i18n.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});