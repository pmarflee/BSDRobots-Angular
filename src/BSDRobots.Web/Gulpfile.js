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
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    bower = require('gulp-bower'),
    app_bundle = 'app.min.js',
    angular_bundle = 'angular.min.js',
    angular_bootstrap_bundle = 'angular-bootstrap.min.js';
    
eval("var project = " + fs.readFileSync("./project.json"));

var paths = {
    app_src: project.webroot + '/app/**/*.*',
    app_scripts: project.webroot + '/app/**/*.js',
    app_out: project.webroot + '/build/scripts',
    app_bundle: project.webroot + '/build/scripts/' + app_bundle,
    app_css: project.webroot + '/app/styles/main.css',
    angular_src: [
        'bower_components/angular/angular.min.js'
    ],
    angular_bundle: project.webroot + '/build/' + angular_bundle,
    angular_bootstrap_src: [
        'bower_components/angular-bootstrap/ui-bootstrap.min.js',
        'bower_components/angular-animate/angular-animate.min.js'
    ],
    angular_bootstrap_bundle: project.webroot + '/build/' + angular_bootstrap_bundle,
    bootstrap_css: 'bower_components/bootstrap-css-only/css/bootstrap.css',
    bootstrap_fonts: 'bower_components/bootstrap-css-only/fonts/*.*',
    fonts_out: project.webroot + '/build/content/dist/fonts',
    css_out: project.webroot + '/build/content/dist/css'
};

gulp.task('default', ['vendor-scripts', 'app-scripts', 'styles']);

gulp.task('vendor-scripts', ['angular-bundle', 'angular-bootstrap-bundle']);

gulp.task('clean-app-scripts', function () {
    del([paths.app_bundle]);
});

gulp.task('clean-vendor-scripts', function () {
    del([paths.angular_bundle, paths.angular_bootstrap_bundle]);
});

gulp.task('angular-bundle', ['clean-vendor-scripts', 'bower-restore'], function () {
    return gulp.src(paths.angular_src)
     .pipe(concat(angular_bundle))
     .pipe(sourcemaps.write())
     .pipe(gulp.dest(paths.app_out))
     .on('error', gutil.log);
});

gulp.task('angular-bootstrap-bundle', ['clean-vendor-scripts', 'bower-restore'], function () {
    return gulp.src(paths.angular_bootstrap_src)
     .pipe(sourcemaps.init())
     .pipe(concat(angular_bootstrap_bundle))
     .pipe(sourcemaps.write())
     .pipe(gulp.dest(paths.app_out))
     .on('error', gutil.log);
});

gulp.task('app-scripts', ['clean-app-scripts'], function () {
    gulp.src(paths.app_scripts)
    .pipe(sourcemaps.init())
    .pipe(concat(app_bundle))
    .pipe(ngAnnotate({ add: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.app_out))
    .on('error', gutil.log);
})

gulp.task('clean-styles', function () {
    del([paths.fonts_out, paths.css_out]);
});

gulp.task('css', ['clean-styles', 'bower-restore'], function () {
    return gulp.src([paths.bootstrap_css, paths.app_css])
     .pipe(concat('app.css'))
     .pipe(gulp.dest(paths.css_out))
     .pipe(minifyCSS())
     .pipe(concat('app.min.css'))
     .pipe(gulp.dest(paths.css_out));
});

gulp.task('fonts', ['clean-styles', 'bower-restore'], function () {
    return gulp.src(paths.bootstrap_fonts).pipe(gulp.dest(paths.fonts_out));
});

gulp.task('styles', ['css', 'fonts'], function () {

});

gulp.task('bower-restore', function () {
    return bower();
});

gulp.task('watch', function () {
    gulp.watch(paths.app_src, ['default']);
});