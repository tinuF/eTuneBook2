import { join } from 'path';

import { SeedConfig } from './seed.config';
import { InjectableDependency } from './seed.config.interfaces';

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
        let additional_deps: InjectableDependency[] = [
            // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
            // {src: 'lodash/lodash.min.js', inject: 'libs'},
            { src: 'bootstrap/dist/css/bootstrap.min.css', inject: true },
            { src: 'mdi/css/materialdesignicons.min.css', inject: true },
            { src: 'mdi/fonts/materialdesignicons-webfont.eot', inject: this.FONTS_DEST },
            { src: 'mdi/fonts/materialdesignicons-webfont.svg', inject: this.FONTS_DEST },
            { src: 'mdi/fonts/materialdesignicons-webfont.ttf', inject: this.FONTS_DEST },
            { src: 'mdi/fonts/materialdesignicons-webfont.woff', inject: this.FONTS_DEST },
            { src: 'mdi/fonts/materialdesignicons-webfont.woff2', inject: this.FONTS_DEST },
            { src: 'jquery/dist/jquery.min.js', inject: 'libs' },
            { src: 'bootstrap/dist/js/bootstrap.min.js', inject: 'libs' },
            { src: 'moment/min/moment.min.js', inject: 'libs' }
        ];

        const seedDependencies = this.NPM_DEPENDENCIES;

        this.NPM_DEPENDENCIES = seedDependencies.concat(additional_deps);

        this.APP_ASSETS = [
            // {src: `${this.ASSETS_SRC}/css/toastr.min.css`, inject: true},
            // {src: `${this.APP_DEST}/assets/scss/global.css`, inject: true},
            { src: `${this.ASSETS_SRC}/abcjs_editor_2.3-min.js`, vendor: true, inject: true }
        ];

    }
}