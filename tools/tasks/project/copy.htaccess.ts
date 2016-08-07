import * as gulp from 'gulp';
import { join } from 'path';
import {APP_SRC, APP_DEST} from '../../config';

/**
 * Copies .htaccess  /client to dist/dev/client or dist/prod/client
 *
 */

export = () => {
  return gulp.src(join(APP_SRC, '.htaccess'))
    .pipe(gulp.dest(APP_DEST));
};
