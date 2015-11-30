var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
plugins.browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
    plugins.browserSync.init({
        proxy: "localhost:80/RING/"
    });
    gulp.watch(["js/**/*","partials/**/*"], function(){
        plugins.browserSync.reload();
    });
});