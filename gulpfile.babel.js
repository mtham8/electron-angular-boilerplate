'use strict';

import { spawn } from 'child_process';
import gulp from 'gulp';
import del from 'del';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import extend from 'xtend';

const $ = gulpLoadPlugins();

const src = {
    html: ['./src/**.html'],
    sass: ['./src/sass/**/*.scss'],
    js: ['./src/js/**/*.js'],
    assets: ['./src/assets/**/*'],
    images: ['./src/images/**/*.jpg', './src/images/**/*.png', './src/images/**/*.gif', './src/images/**/*.svg']
};

const build = {
    dir: './build',
    html: './build/html',
    js: './build/js',
    css: './build/css',
    lib: './build/lib',
    assets: './build/assets',
    images: './build/images'
};

const dest = './build';

gulp.task('clean:bower', () => {
    return del(['lib/**/*']);
});

gulp.task('bower', cb =>
    gulp.src('./src/bower.json')
    .pipe($.mainBowerFiles())
    .pipe(gulp.dest('build/lib')));

gulp.task('scripts', cb =>
    gulp.src(src.js)
    .pipe($.babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest(build.js))
    .pipe($.if(browserSync.active, browserSync.stream()))
);

gulp.task('angularTemplateCache', cb =>
    gulp.src('./src/templates/*.html')
    .pipe($.angularTemplatecache({
        standalone: true
    }))
    .pipe(gulp.dest('./build/js'))
);

gulp.task('copy:html', ['angularTemplateCache'], cb =>
    gulp.src(src.html)
    .pipe(gulp.dest(build.dir))
);

gulp.task('copy:assets', cb => gulp.src(src.assets).pipe(gulp.dest(build.assets)));
gulp.task('copy:images', cb => gulp.src(src.images).pipe(gulp.dest(build.images)));
gulp.task('copy:mainproc', cb => gulp.src('./src/main.js').pipe(gulp.dest(build.dir)));

// this copies the package json and does a production npm install
gulp.task('copy:json', () => {
    gulp.src('package.json')
        .pipe(gulp.dest(build.dir))
        .pipe($.exec('npm --prefix ' + build.dir + ' prune; npm --prefix ' + build.dir + ' install --production --quiet'))
        .pipe($.exec.reporter());
});

gulp.task('copy', ['copy:images', 'copy:assets', 'copy:html', 'copy:mainproc', 'copy:json']);

gulp.task('styles', () =>
    gulp.src("./src/sass/index.scss")
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest(build.css))
    .pipe($.if(browserSync.active, browserSync.stream()))
);

gulp.task('build', ['copy', 'styles', 'bower', 'scripts']);

function runElectronApp(path, env = {}) {
    const electron = require('electron-prebuilt');
    const options = {
        env: extend({
            NODE_ENV: 'development'
        }, env, process.env),
        stdio: 'inherit'
    };
    return spawn(electron, [path], options);
}

gulp.task('serve', ['build'], () => {
    runElectronApp(dest);
});

gulp.task('watch', ['build'], cb => {
    function getRootUrl(options) {
        const port = options.get('port');
        return `http://localhost:${port}`;
    }

    function getClientUrl(options) {
        const connectUtils = require('browser-sync/lib/connect-utils');
        const pathname = connectUtils.clientScript(options);
        return getRootUrl(options) + pathname;
    }

    const options = {
        ui: false,
        port: 35829,
        ghostMode: false,
        open: false,
        notify: false,
        logSnippet: false,
        socket: {
            // Use the actual port here.
            domain: getRootUrl
        }
    };

    browserSync.init(options, (err, bs) => {
        if (err) {
            return cb(err);
        }

        runElectronApp(dest, {
            BROWSER_SYNC_CLIENT_URL: getClientUrl(bs.options)
        });

        browserSync.watch(src.js)
            .on('change', () => gulp.start('scripts'));
        browserSync.watch(src.html)
            .on('change', () => gulp.start('copy:html', browserSync.reload));

        browserSync.watch(src.assets)
            .on('change', () => gulp.start('copy:assets', browserSync.reload));

        browserSync.watch(src.sass)
            .on('change', () => gulp.start('styles'));

        cb();
    });
});
