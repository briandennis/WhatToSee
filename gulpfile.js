var gulp = require('gulp'),
    exec = require('gulp-exec'),
    sass = require('gulp-ruby-sass'),
    nodemon = require('gulp-nodemon');

gulp.task('compileReact',function(){
  gulp.src('').pipe(exec('browserify -t [ babelify --presets [ react ] ] public/js/main.js -o public/js/bundle.js'));
});

gulp.task('styles',function(){
  return sass('public/scss/index.scss')
         .pipe(gulp.dest('public/css/'));
});

gulp.task('watch',function(){
  gulp.watch('public/js/main.js',['compileReact']);
  gulp.watch('public/scss/index.scss',['styles']);
});

gulp.task('server', function(){
  nodemon({script: 'server.js'});
});

gulp.task('default',['watch', 'server']);
