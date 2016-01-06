var gulp = require('gulp'),
    exec = require('gulp-exec'),
    sass = require('gulp-ruby-sass');

gulp.task('compileReact',function(){
  gulp.src('').pipe(exec('browserify -t [ babelify --presets [ react ] ] js/main.js -o js/bundle.js'));
});

gulp.task('styles',function(){
  return sass('scss/index.scss')
         .pipe(gulp.dest('css/'));
});

gulp.task('watch',function(){
  gulp.watch('js/main.js',['compileReact']);
  gulp.watch('scss/index.scss',['styles']);
});

gulp.task('default',['watch']);
