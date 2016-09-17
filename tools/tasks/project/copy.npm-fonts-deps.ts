import * as gulp from 'gulp';
import {join} from 'path';
import Config from '../../config';

/**
 * Copies font NPM dependencies from /node-modules to dist/dev/lib/fonts or dist/prod/lib/fonts
 *
 */

export = () => {
  let src = [
    'node_modules/mdi/fonts/**',
  ];

  return gulp.src(src)
    .pipe(gulp.dest(join(Config.APP_DEST, 'lib/fonts/')));
};
