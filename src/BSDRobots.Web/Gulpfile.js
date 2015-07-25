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
    sourcemaps = require('gulp-sourcemaps'),
    bower = require('gulp-bower'),
    app_bundle = 'app.min.js',
    jquery_bundle = 'jquery.min.js',
    bootstrap_bundle = 'bootstrap.min.js';
    
eval("var project = " + fs.readFileSync("./project.json"));

var paths = {
    app_src: project.webroot + '/app/**/*.js',
    app_out: project.webroot + '/build',
    app_bundle: project.webroot + '/build/' + app_bundle,
    jquery_src: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/jquery-validation/dist/jquery.validate.min.js',
        'bower_components/jquery-validation-unobtrusive/jquery.validate.unobtrusive.min.js'
    ],
    jquery_bundle: 'Scripts/jquery-bundle.min.js',
    bootstrap_src: [
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/respond-minmax/dest/respond.min.js'
    ],
    bootstrap_bundle: project.webroot + '/build/' + bootstrap_bundle,
    bootstrap_css: 'bower_components/bootstrap/dist/css/bootstrap.css'
};

gulp.task('default', ['vendor-scripts', 'app-scripts']);

gulp.task('vendor-scripts', ['jquery-bundle', 'bootstrap-bundle']);

gulp.task('clean-app-scripts', function () {
    del([paths.app_bundle]);
});

gulp.task('clean-vendor-scripts', function () {
    del([paths.jquery_bundle, paths.bootstrap_bundle]);
});

gulp.task('jquery-bundle', ['clean-vendor-scripts', 'bower-restore'], function () {
    return gulp.src(paths.jquery_src)
     .pipe(concat(jquery_bundle))
     .pipe(gulp.dest(paths.app_out))
     .on('error', gutil.log);
});

gulp.task('bootstrap-bundle', ['clean-vendor-scripts', 'bower-restore'], function () {
    return gulp.src(paths.bootstrap_src)
     .pipe(sourcemaps.init())
     .pipe(concat(bootstrap_bundle))
     .pipe(sourcemaps.write())
     .pipe(gulp.dest(paths.app_out))
     .on('error', gutil.log);
});

gulp.task('app-scripts', ['clean-app-scripts'], function () {
    gulp.src(paths.app_src)
    .pipe(sourcemaps.init())
    .pipe(concat(app_bundle))
    .pipe(ngAnnotate({ add: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.app_out))
    .on('error', gutil.log);
})

gulp.task('bower-restore', function () {
    return bower();
});

gulp.task('watch', function () {
    gulp.watch(paths.app_src, ['app-scripts']);
});