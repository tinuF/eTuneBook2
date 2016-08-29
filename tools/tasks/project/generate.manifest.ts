import * as gulp from 'gulp';

import { APP_DEST } from '../../config';

/**
 * Executes the build process, generating the manifest file using `angular2-service-worker`.
 */
export = () => {
  return require('angular2-service-worker')
    .gulpGenManifest({
      group: [{
        name: 'css',
        sources: gulp.src(`${APP_DEST}/**/*.css`)
      }, {
        name: 'js',
        sources: gulp.src(`${APP_DEST}/**/*.js`)
      }, {
        name: 'woff2',
        sources: gulp.src(`${APP_DEST}/**/*.woff2`)
      }]
    })
    .pipe(gulp.dest(APP_DEST));
};
