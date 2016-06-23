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
            { src: 'bootstrap/dist/css/bootstrap.min.css', inject: true },
            { src: 'mdi/css/materialdesignicons.min.css', inject: true },
            { src: 'mdi/fonts/materialdesignicons-webfont.eot', inject: this.FONTS_DEST },
            { src: 'mdi/fonts/materialdesignicons-webfont.svg', inject: this.FONTS_DEST },
            { src: 'mdi/fonts/materialdesignicons-webfont.ttf', inject: this.FONTS_DEST },
            { src: 'mdi/fonts/materialdesignicons-webfont.woff', inject: this.FONTS_DEST },
            { src: 'mdi/fonts/materialdesignicons-webfont.woff2', inject: this.FONTS_DEST },
            //{ src: 'jquery/dist/jquery.min.js', inject: 'libs' },
            { src: 'bootstrap/dist/js/bootstrap.min.js', inject: 'libs' },
            //{ src: 'moment/min/moment.min.js', inject: 'libs' }
        ];

        const seedDependencies = this.NPM_DEPENDENCIES;
        this.NPM_DEPENDENCIES = seedDependencies.concat(additional_deps);

        let additional_assets: InjectableDependency[] = [
            { src: `${this.ASSETS_SRC}/abcjs_editor_2.3-min.js`, vendor: true, inject: 'libs' }
        ];

        const seedAssets = this.APP_ASSETS;
        this.APP_ASSETS = seedAssets.concat(additional_assets);

        // moment
        (<any>this.SYSTEM_CONFIG_DEV.paths)['moment'] = '/node_modules/moment/moment.js';

        // jquery
        (<any>this.SYSTEM_CONFIG_DEV.paths)['jquery'] = '/node_modules/jquery/dist/jquery.min.js';

        // abcjs
        //(<any>this.SYSTEM_CONFIG_DEV.paths)['ABCJS'] = '/src/client/assets/abcjs_editor_2.3-min.js';

    }
}