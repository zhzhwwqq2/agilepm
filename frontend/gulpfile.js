var gulp = require('gulp'),
    clean = require('gulp-clean'),
    path=require("path"),
    rename = require('gulp-rename'),//文件更名
    uglify = require('gulp-uglify');//js压缩

var srcRoot=__dirname,
    srcViews= srcRoot,
    srcScripts=path.join(srcRoot,"/js"),
    srcImages=path.join(srcRoot,"/images"),
    srcLib=path.join(srcRoot,"/lib"),
    srcCss=path.join(srcRoot,"/css"),

    distRoot=path.join(__dirname,"/dist"),
    distViews=distRoot,

    distScripts=path.join(distRoot,"/js"),
    distImages=path.join(distRoot,"/images"),
    distLib=path.join(distRoot,"/lib"),
    distCss=path.join(distRoot,"/css");

gulp.task('clear', function () {
    return gulp.src(distRoot).pipe(clean());
});

gulp.task('copy-html', function () {
    return gulp.src([srcViews+'/*.html','!'+srcViews+'/*-tmpl.html'])
        .pipe(gulp.dest(distViews));
});

gulp.task('copy-js', function () {
    return gulp.src([srcScripts+'/**/*.*','!'+srcScripts+'/*.js*'])
        .pipe(gulp.dest(distScripts));
});

gulp.task('min-js', function () {
    return gulp.src([srcScripts+'/*.js*','!'+srcScripts+'/*.map'])
        .pipe(uglify())
        .pipe(gulp.dest(distScripts));
});

gulp.task('copy-img', function () {
    return gulp.src([srcImages+'/**/*.*'])
        .pipe(gulp.dest(distImages));
});

gulp.task('copy-lib', function () {
    return gulp.src([srcLib+'/**/*.*'])
        .pipe(gulp.dest(distLib));
});

gulp.task('copy-css', function () {
    return gulp.src([srcCss+'/*.*'])
        .pipe(gulp.dest(distCss));
});

gulp.task('default',["copy-html","copy-js","copy-img","copy-lib","copy-css","min-js"], function () {
});