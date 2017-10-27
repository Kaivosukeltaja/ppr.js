import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import karma from 'karma';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import watch from 'gulp-watch';
import order from 'gulp-order';
import webserver from 'gulp-webserver';
import _ from 'lodash';

const KarmaServer = karma.Server;
const OrderedFileList = [
  'config.js',
  'library/**/!(index|date)*.js',
  'translation.js',
  'library/utils/date.js',
  'library/*/index.js',
  'library/index.js',
  'page/!(index)*.js',
  'page/index.js',
  'component/!(index)*.js',
  'component/index.js',
  'module/!(index)*.js',
  'module/index.js',
  'ui/!(index)*.js',
  'ui/index.js',
  'ppr.js',
];

const BabelOptions = {
  moduleId: 'ppr',
  sourceRoot: 'ppr',
  getModuleId: (moduleName) => {
    let realModuleName = _.filter(moduleName.split('/')).join('.');

    if (_.endsWith(realModuleName, '.index')) {
      realModuleName = realModuleName.slice(0, -6);
    }

    return realModuleName;
  },
};

gulp.task('default', () => gulp.start('build:dev', 'watch'));
gulp.task('build', () => gulp.start('build:dist', 'build:dev'));

gulp.task('eslint', () => (
  gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
));

gulp.task('build:dev', ['eslint'], () => (
  gulp.src('src/**/*.js', { read: true })
    .pipe(order(OrderedFileList, { base: 'src/' }))
    .pipe(babel(BabelOptions))
    .on('error', (error) => {
      console.log(error.toString());
    })
    .pipe(concat('ppr.js'))
    .pipe(gulp.dest('dist'))
));

gulp.task('build:dist', [], () => (
  gulp.src('src/**/*.js')
    .pipe(order(OrderedFileList))
    .pipe(babel(BabelOptions))
    .pipe(uglify({ compress: { drop_console: true } }))
    .pipe(concat('ppr.min.js'))
    .pipe(gulp.dest('dist'))
));

gulp.task('test', (done) => {
  new KarmaServer({
    configFile: `${__dirname}/karma.conf.js`,
    singleRun: true,
    sourceList: OrderedFileList,
  }, done).start();
});

gulp.task('test:watch', (done) => {
  new KarmaServer({
    configFile: `${__dirname}/karma.conf.js`,
    singleRun: false,
    sourceList: OrderedFileList,
  }, done).start();
});

gulp.task('serve', () => {
  gulp.src('.')
    .pipe(webserver({
      host: 'localhost',
      port: 8000,
      livereload: true,
      directoryListing: false,
    }));
});


gulp.task('watch', () => {
  watch(['src/**/*.js'], () => gulp.start('build:dev'));
});
