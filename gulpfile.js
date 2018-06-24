/* global require */
/* global gulp */
var gulp = require('gulp');
var watch = require('gulp-watch');
var prefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rigger = require('gulp-rigger');
var cssmin = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var rimraf = require('rimraf');
var browserSync = require("browser-sync");

var reload = browserSync.reload;

var path = {
    build: {
        html: 'deploy/',
        js: 'deploy/js/',
        css: 'deploy/css/',
        img: 'deploy/img/',
        fonts: 'deploy/fonts/'
    },
    src: {
        html: 'dev/*.html',
        js: 'dev/js/main.js',
        style: 'dev/style/main.scss',
        img: 'dev/img/**/*.*',
        fonts: 'dev/fonts/**/*.*'
    },
    watch: {
        html: 'dev/**/*.html',
        js: 'dev/js/**/*.js',
        style: 'dev/style/**/*.scss',
        img: 'dev/img/**/*.*',
        fonts: 'dev/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./deploy"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};



gulp.task("html:build", function buildHTML () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});


gulp.task('js:build', function buildJS () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function buildStyles () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function buildImages () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function buildFonts () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('watch', function watches (){
    watch([path.watch.html], function watchHTML () {
        gulp.start('html:build');
    });
    watch([path.watch.style], function watchStyle () {
        gulp.start('style:build');
    });
    watch([path.watch.js], function watchJS () {
        gulp.start('js:build');
    });
    watch([path.watch.img], function watchImg () {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function watchFonts () {
        gulp.start('fonts:build');
    });
});

gulp.task('clean', function clean (cb) {
    rimraf(path.clean, cb);
});


gulp.task('serve', function startServer () {
    browserSync(config);
    gulp.watch(path.src.html, ["html:build"]);
    gulp.watch(path.build.html).on('change', browserSync.reload);

    gulp.watch(path.src.img, ['image:build']);
    gulp.watch(path.build.img).on('change', browserSync.reload);

    gulp.watch(path.src.style, ['style:build']);
    gulp.watch(path.build.css).on('change', browserSync.reload);

    gulp.watch(path.src.fonts, ['fonts:build']);
    gulp.watch(path.build.fonts).on('change', browserSync.reload);

    gulp.watch(path.src.js, ['js:build']);
    gulp.watch(path.build.js).on('change', browserSync.reload);
});

