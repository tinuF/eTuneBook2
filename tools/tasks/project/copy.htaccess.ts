import * as gulp from 'gulp';
import { join } from 'path';
import Config from '../../config';

/**
 * Copies .htaccess  /client to dist/dev/client or dist/prod/client
 *
 */

export = () => {
  return gulp.src(join(Config.APP_SRC, '.htaccess'))
    .pipe(gulp.dest(Config.APP_DEST));
};
