var gulp = require('gulp'),
  buildConfig = require('./build/config.js'),
  browserify = require("browserify"),
  fs = require("fs"),
  tslint = require('gulp-tslint'),
  replace = require('gulp-replace'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  del = require('del'),
  ts = require('gulp-typescript');

gulp.task('version', ['minify'], function() {
  return gulp.src('dist/**/*.js')
    .pipe(replace('VERSION_STRING', buildConfig.versionData.version))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', ['build-bundle'], function() {
  return gulp.src('dist/*.js')
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['version']);

gulp.task('build-bundle', ['clean', 'lint', 'build-definitions', 'build-es6', 'build-commonjs'], function() {
  return browserify(["src/es5.js", "src/core/angular.js", "src/analytics/angular.js", "src/auth/angular.js", "src/push/angular.js", "src/deploy/angular.js", "dist/es6/index.js"], { "debug": true })
    .transform("babelify", { "presets": ["es2015"] })
    .require('es6-promise')
    .bundle()
    .on("error", function(err) { console.log("Error : " + err.message); })
    .pipe(fs.createWriteStream(buildConfig.dist + "/ionic.io.bundle.js"));
});

gulp.task('clean', function() {
  return del(['dist/**/*']);
});

gulp.task('lint', function() {
  return gulp.src('src/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report("verbose"));
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['src/**/*.ts'], ['build']);
});

gulp.task('default', ['build']);

gulp.task('build-definitions', function() {
  return gulp.src(buildConfig.sourceFiles.ts).pipe(ts({
    "declaration": true,
    "target": "es6"
  })).dts.pipe(gulp.dest('dist/typings'));
});

gulp.task('build-es6', function() {
  return gulp.src(buildConfig.sourceFiles.ts).pipe(ts({
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es6",
    "moduleResolution": "node",
    "typescript": require('typescript')
  })).js.pipe(gulp.dest('dist/es6'));
});

gulp.task('build-commonjs', function() {
  return gulp.src(buildConfig.sourceFiles.es6).pipe(ts({
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es5",
    "module": "commonjs",
    "moduleResolution": "node",
    "typescript": require('typescript')
  })).js.pipe(gulp.dest('dist/commonjs'));
});
