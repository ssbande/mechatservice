'use strict'
const gulp = require('gulp');
const tslint = require('gulp-tslint');
const tsc = require('gulp-typescript');
const gsm = require('gulp-sourcemaps');
let tsServer = tsc.createProject('tsconfig.json');

// configuration to read source files from
const sourceConfig = {
    ts: 'src/**/*.ts'
}

// Configuration to put the compiled files to.
const build = 'build/'
const outputConfig = {
    ts: `${build}/`
}

// Task for linting the files. This should lint all the ts files in the project.
gulp.task('lint', () => {
    return gulp.src(sourceConfig.ts)
        .pipe(tslint({ formatter: 'prose' }))
        .pipe(tslint.report({ emitError: true }));
    // Making the task to throw error in case there is a linting error.
    // { emitError: true }
});

// Task for compiling the ts files in server.
gulp.task('server', () => {
    var serverTs = gulp.src(sourceConfig.ts).pipe(gsm.init()).pipe(tsServer());
    return serverTs.js.pipe(gsm.write(outputConfig.ts)).pipe(gulp.dest(outputConfig.ts));
});

gulp.task('watch', function() {
    gulp.watch(sourceConfig.ts, ['server']);
});

gulp.task('build', ['lint', 'server']);
gulp.task('default', ['build']);
