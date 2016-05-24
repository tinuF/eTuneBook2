import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { TuneBookService } from '../../business/index';
import { TuneRandomizerComponent } from '../nav/tune-randomizer.component';


@Component({
    moduleId: module.id,
    selector: 'etb-side-nav',
    templateUrl: 'side-nav.component.html',
    styleUrls: ['side-nav.component.css'],
    directives: [ROUTER_DIRECTIVES, TuneRandomizerComponent]
})
export class SideNavigationComponent {

    constructor(public tuneBookService: TuneBookService) {

    }
}
