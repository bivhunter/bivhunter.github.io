'use strict'

const gulp = require('gulp');

gulp.task('default', () => {
    gulp.src('src/**/*.*')
        .on('data', (file) => {
            console.log(file);
        })
        .pipe(gulp.dest('copySrc'));
});