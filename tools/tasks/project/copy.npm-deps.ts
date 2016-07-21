import * as gulp from 'gulp';
import {join} from 'path';
import {APP_DEST} from '../../config';

/**
 * Copies all NPM dependencies from /node-modules to dist/dev/lib or dist/prod/lib
 *
 */

export = () => {
  let src = [
    'node_modules/bootstrap/dist/**',
    'node_modules/mdi/**',
    'node_modules/jquery/dist/jquery.min.js',
    '!' + 'node_modules/**/*.json',
    '!' + 'node_modules/**/*.txt',
    '!' + 'node_modules/**/*.html',
    '!' + 'node_modules/**/*.md',
    '!' + 'node_modules/**/*.scss',
    //join(NPM_BASE, '/bootstrap/dist/', '**')
  ];

  return gulp.src(src)
    .pipe(gulp.dest(join(APP_DEST, 'lib/')));
};
