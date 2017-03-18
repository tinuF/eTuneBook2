import { join } from 'path';

import { SeedConfig } from './seed.config';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {
    PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

    FONTS_DEST = `${this.APP_DEST}/fonts`;

    constructor() {
        super();
        this.APP_TITLE = 'eTuneBook';
        /*
        this.NPM_DEPENDENCIES = [
            ...this.NPM_DEPENDENCIES,
            //{ src: 'bootstrap/dist/css/bootstrap.min.css', inject: true },
            //{ src: 'mdi/css/materialdesignicons.min.css', inject: true },
            //{ src: 'mdi/fonts/materialdesignicons-webfont.eot', inject: this.FONTS_DEST },
            //{ src: 'mdi/fonts/materialdesignicons-webfont.svg', inject: this.FONTS_DEST },
            //{ src: 'mdi/fonts/materialdesignicons-webfont.ttf', inject: this.FONTS_DEST },
            //{ src: 'mdi/fonts/materialdesignicons-webfont.woff', inject: this.FONTS_DEST },
            //{ src: 'mdi/fonts/materialdesignicons-webfont.woff2', inject: this.FONTS_DEST },
            //jquery is needed by bootstrap (dropdown) -> must be injected
            //{ src: 'jquery/dist/jquery.min.js', inject: 'libs' },
            //{ src: 'bootstrap/dist/js/bootstrap.min.js', inject: 'libs' },
            //{ src: 'moment/min/moment.min.js', inject: 'libs' }
            // Nicht nötig für abcjs. abcjs wird via <script> in index.html gelesen
            //{ src: `${this.PROJECT_ROOT}/${this.APP_DEST}/lib/abcjs_editor_2.3-min.js`, inject: 'libs' }
        ];
        */

        // Nicht nötig für abcjs. abcjs wird via <script> hard-codiert in index.html gelesen und
        // im Build (durch build.assets.dev resp. build.assets.prod) zusammen mit dem lib-Verzeichnis in die dist-Umgebung kopiert.
        // Add `local` third-party libraries to be injected/bundled.
        //this.APP_ASSETS = [
        //  ...this.APP_ASSETS,
        //{src: `${this.APP_SRC}/lib/abcjs_editor_2.3-min.js`, inject: 'libs', vendor: true}
        // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
        //];

        // moment in import statements
        //(<any>this.SYSTEM_CONFIG_DEV.paths)['moment'] = '/node_modules/moment/moment.js';
        this.SYSTEM_CONFIG_DEV.paths['moment'] =
            `${this.APP_BASE}node_modules/moment/moment.js`;
            this.SYSTEM_BUILDER_CONFIG.packages['moment'] = {
                main: 'moment.js',
                defaultExtension: 'js'
            };

        this.SYSTEM_CONFIG_DEV.paths['angular2-moment'] =
            `${this.APP_BASE}node_modules/angular2-moment/index.js`;
            this.SYSTEM_BUILDER_CONFIG.packages['angular2-moment'] = {
                main: 'index.js',
                defaultExtension: 'js'
            };
        /** funktioniert nicht
        this.SYSTEM_CONFIG_DEV.paths['@angular/platform-browser/animations'] =
            `${this.APP_BASE}node_modules/@angular/platform-browser/bundles/platform-browser-animations.umd.min.js`;
            this.SYSTEM_BUILDER_CONFIG.packages['@angular/platform-browser/bundles'] = {
                main: 'platform-browser-animations.umd.min.js',
                defaultExtension: 'js'
            };
        */
        // jquery in import statements
        (<any>this.SYSTEM_CONFIG_DEV.paths)['jquery'] = '/node_modules/jquery/dist/jquery.min.js';

        //this.SYSTEM_BUILDER_CONFIG.meta = {
        //  'src/client/lib/abcjs_editor_2.3-min.js': {
        //    build: false
        //}
        //};

        //Ebenfalls nicht nötig für Production Build: In build.bundles.app.ts:
        /*
        const BUNDLER_OPTIONS = {
            format: 'cjs',
            minify: false,
            mangle: false,
            //externals: ['abcjs_editor_2.3'],
            //globalDeps: {
            //'abcjs_editor_2.3': 'ABCJS'
            //}
        };
        */

    }
}
