import * as gulp from 'gulp';
import {join} from 'path';
import Config from '../../config';

/**
 * Copies css NPM dependencies from /node-modules to dist/dev/lib/css or dist/prod/css
 *
 */

export = () => {
  let src = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/mdi/css/materialdesignicons.min.css',
  ];

  return gulp.src(src)
    .pipe(gulp.dest(join(Config.APP_DEST, 'lib/css/')));
};
