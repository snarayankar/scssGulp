
'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    proxyMiddleware = require('http-proxy-middleware'),
    bs = require("browser-sync").create();



//Proxy to a target URL
 var proxy = proxyMiddleware(["localhost:3000"], {
   changeOrigin: true,
   target: "https://santestAppProxy",
   secure: false //dunno why this is required even though we have the certificate and key defined...
});

//process sass to css
gulp.task('sass', function () {
    return gulp.src('styles/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./styles/'));
    }
);

//keeps an eye on any changes
gulp.task('sass:watch', function () {
    gulp.watch('styles/*.scss', ['sass']);
});

//crete a local gulp server
gulp.task('webserver', function() {
    connect.server({
    root: ['.', '.tmp'],
    port: 3000,
    livereload: true,
    host: 'sanApp',
    proxy: 'localhost',
    middleware: function (connect, opt) {
      // var Proxy = require('gulp-connect-proxy');
      // opt.route = '/proxy';
      // var proxy = new Proxy(opt);
      return [proxy];
    }
  });
});

//I also added html reload
gulp.task('livereload', function() {
    gulp.src(['styles/*.scss', 'index.html'])
    .pipe(watch())
    .pipe(connect.reload());
});

//Another way of browser sync
//gulp.task('browser-sync', function() {
// bs.init({
//     proxy: 'http://sanApp',
//     port: '3000'
// });
//});

//This is more of a generic watch cycle
// gulp.task('watch', function() {
//     gulp.watch('.tmp/styles/*.scss');
//   gulp.watch('styles/*.less', ['less']);
//   gulp.watch('scripts/*.coffee', ['coffee']);
// });


gulp.task('default', ['sass', 'webserver', 'livereload', 'sass:watch']);
