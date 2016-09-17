import * as gulp from 'gulp';
import {join} from 'path';
import Config from '../../config';

/**
 * Copies js NPM dependencies from /node-modules to dist/dev/lib/js or dist/prod/lib/js
 *
 */

export = () => {
  let src = [
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/jquery/dist/jquery.min.js',
  ];

  return gulp.src(src)
    .pipe(gulp.dest(join(Config.APP_DEST, 'lib/js/')));
};
