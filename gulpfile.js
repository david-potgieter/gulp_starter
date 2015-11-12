var gulp      = require('gulp'),
    sass      = require('gulp-sass'),
    concat    = require('gulp-concat'),
    watch     = require('gulp-watch'),
    babel     = require("gulp-babel"),
    minifycss = require('gulp-minify-css'),
    rename    = require('gulp-rename'),
    notify    = require("gulp-notify"),
    plumber   = require('gulp-plumber'),
    inject    = require('gulp-inject'),
    injectStr = require('gulp-inject-string')
    bulkSass  = require('gulp-css-globbing'),
    rename    = require('gulp-rename'),
    inCSS     = 'build/build.scss',
    extraCSS  = './build/modules/**/*.scss',
    outCSS    = './Content/css/',
    inJS      = 'build/**/*.js',
    outJS     = './Content/js/';

gulp.task('injectHTML', function(){
    var target = gulp.src('./index.html');
    var sources = gulp.src(['./Content/js/**/*.js', './Content/css/**/*.css'], {read: false, relative:false});
    return target.pipe(inject(sources)).pipe(gulp.dest('./'));
});

gulp.task('appendJSVersion', function(){
    return gulp.src('./index.html')
       .pipe(injectStr.append('<script src="/Content/js/main.js'+'?ver=123'+'"></script>'))
       .pipe(gulp.dest('./'))
});

gulp.task('styles', function() {
    var onError = function(err) {
        notify.onError({title: "Gulp", subtitle: "SASS Failure!", message:  "Error: <%= error.message %>", sound: "Beep"})(err);
        this.emit('end');
    };
    return gulp.src(inCSS)
        .pipe(bulkSass({extensions: ['.css', '.scss']}))
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({includePaths: [extraCSS]}))
        .pipe(sass({ style: 'expanded' }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(outCSS))
});

gulp.task('scripts', function() {
    var onError = function(err) {
        notify.onError({title: "Gulp", subtitle: "JS Failure!", message: "Error: <%= error.message %>", sound: "Beep"})(err);
        this.emit('end');
    };
    return gulp.src(inJS)
        .pipe(plumber({errorHandler: onError}))
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(outJS))
});

gulp.task('watch',function() {
    gulp.watch(inJS,['scripts']);
    gulp.watch([inCSS,extraCSS],['styles']);
});

gulp.task('default',['scripts','styles']);
