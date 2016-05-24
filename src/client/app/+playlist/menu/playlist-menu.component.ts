import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { TuneBookService } from '../../business/index';
import { EditButtonComponent } from '../../shared/modus/edit-btn.component';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-menu',
    templateUrl: 'playlist-menu.component.html',
    directives: [ROUTER_DIRECTIVES, EditButtonComponent],
    styleUrls: ['playlist-menu.component.css'],
})
export class PlayListMenuComponent {

    constructor(public tuneBookService: TuneBookService) {

    }
}


