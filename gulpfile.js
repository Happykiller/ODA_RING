var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
plugins.browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
    plugins.browserSync.init({
        proxy: "localhost:80/RING/"
    });
    gulp.watch(["js/**/*","partials/**/*","i8n/**/*"], function(){
        plugins.browserSync.reload();
    });
});

gulp.task('scss', function () {
    gulp.src('css/**/*.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer({
            browsers:['last 2 versions']
        }))
        .pipe(gulp.dest('css/'));
});

gulp.task('watch',['scss'], function () {
    gulp.watch('css/**/*.scss' , ['scss']);
});