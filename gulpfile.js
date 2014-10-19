var gulp = require('gulp');
var run = require('gulp-run');
var taskListing = require('gulp-task-listing');
var mainBowerFiles = require('main-bower-files');
var del = require('del');
var sass = require('gulp-sass');
var protractor = require("gulp-protractor").protractor;
var webdriver_standalone = require("gulp-protractor").webdriver_standalone;
var karma = require('gulp-karma');

//Should read this from karma config
var testFiles = [
  'public/lib/*.js',
  'node_modules/angular-mocks/angular-mocks.js',
  'public/js/*.js',
  'test/unit/**/*.js',
];

var clientLibraryDir = "./public/lib";

gulp.task('default', taskListing);

gulp.task('cleanLibraries', function() {
  del([clientLibraryDir], function(err) {
    if(err)
      throw err;
    return clientLibraryDir + " cleaned";
  });
});

gulp.task('regenerateLibraries', ['cleanLibraries'], function() {
  var result = "";
  result += run('npm install').exec();
  result += "\n";
  result += run('bower install').exec();
  result += "\n";
  result += gulp.src(mainBowerFiles())
    .pipe(gulp.dest(clientLibraryDir));
  return result;
});

gulp.task('sass', function() {
  return gulp.src('./unprocessedResources/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/resources/css'));
});

gulp.task('test:unit', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: './config/karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('test:unit:watch', function() {
  gulp.src(testFiles)
    .pipe(karma({
      configFile: './config/karma.conf.js',
      action: 'watch'
    }));
});

gulp.task('test:functional', function() {
    // run('node server.js');
    // run('webdriver-manager start');
    //run('protractor conf.js').exec();
});
