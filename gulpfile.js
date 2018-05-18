const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserify = require('gulp-browserify');
const babel = require('gulp-babel');
const del = require('del');

const paths = {
  scss: ['./scripts/*.scss'],
  js: ['./scripts/*.js'],
};

gulp.task('clean', () => del(['./public/css'], ['./public/js']));

gulp.task('scss', () =>
  gulp
    .src(paths.scss)
    .pipe(sass({
      outputStyle: 'compressed',
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css')));

gulp.task('js', () =>
  gulp
    .src(paths.js)
    .pipe(babel({
      presets: ['env'],
    }))
    .pipe(browserify({
      insertGlobals: true,
    }))
    .pipe(uglify())
    .pipe(concat('index.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/js')));

gulp.task('watch', () => {
  gulp.watch(paths.scss, ['scss']);
  gulp.watch(paths.js, ['js']);
});

gulp.task(
  'default',
  gulp.series('clean', gulp.parallel('scss', 'js')),
);
