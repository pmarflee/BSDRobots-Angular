/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var fs = require("fs"),
    del = require('del'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    ngAnnotate = require('gulp-ng-annotate'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

eval("var project = " + fs.readFileSync("./project.json"));

var paths = {
    app_src: project.webroot + '/app/**/*.js',
    app_bundle: project.webroot + '/build'
};

gulp.task('default', ['clean', 'bundleandminify']);

gulp.task('clean', function () {
    del([paths.app_bundle + '/*']);
});

gulp.task('bundleandminify', function () {
    gulp.src(paths.app_src)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate({ add: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.app_bundle))
    .on('error', gutil.log);
})

gulp.task('watch', function () {
    gulp.watch(paths.app_src, ['bundleandminify']);
});