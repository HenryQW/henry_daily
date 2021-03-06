const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserify = require('gulp-browserify');
const babel = require('gulp-babel');
const del = require('del');

const paths = {
    scss: ['./public/scripts/*.scss'],
    js: ['./public/scripts/*.js'],
};

gulp.task('clean', () => del(['./public/css'], ['./public/js']));

gulp.task('scss', () =>
    gulp
        .src(paths.scss)
        .pipe(
            sass({
                outputStyle: 'compressed',
            }).on('error', sass.logError)
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
);

gulp.task('js', () =>
    gulp
        .src(paths.js)
        .pipe(
            babel({
                presets: ['@babel/preset-env'],
                plugins: [
                    [
                        '@babel/plugin-transform-runtime',
                        {
                            regenerator: true,
                        },
                    ],
                ],
            })
        )
        .pipe(
            browserify({
                insertGlobals: true,
            })
        )
        .pipe(uglify())
        .pipe(concat('index.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/js'))
);

gulp.task('watch', () => {
    gulp.watch(paths.scss, gulp.series('scss'));
    gulp.watch(paths.js, gulp.series('js'));
});

gulp.task(
    'default',
    gulp.series('clean', gulp.parallel('scss', 'js'), 'watch')
);

gulp.task('deploy', gulp.series('clean', gulp.parallel('scss', 'js')));
