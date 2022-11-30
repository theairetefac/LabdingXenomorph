import gulp from 'gulp';
import browserSync from 'browser-sync';
import csso from 'gulp-csso';
import htmlmin from 'gulp-htmlmin';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import {deleteAsync} from 'del';
import webp from 'gulp-webp';

const outputPath = "./dist";
const sync = browserSync.create();

function html() {
    return gulp.src('app/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(outputPath));
}

function scss() {
    return gulp.src('app/css/style.scss')
        .pipe(gulpSass(sass)())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        }))
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(outputPath+'/css'));
}

function img() {
    return gulp.src('app/img/*.*')
        .pipe(webp())
        .pipe(gulp.dest(outputPath+"/img"));
}

function clear() {
    return deleteAsync(outputPath);
}

function watch() {
    sync.init({
        server: outputPath
    });

    gulp.watch('app/**/*.html', html).on('change', sync.reload);
    gulp.watch('app/**/*.scss', scss).on('change', sync.reload);
}

const build = gulp.series(clear, gulp.parallel(html, scss, img));
const serve = gulp.series(build, watch);

export {
    build,
    serve
}

export default build;