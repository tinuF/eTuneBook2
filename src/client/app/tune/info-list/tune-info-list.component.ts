import { Component, Input } from '@angular/core';

import { TuneBookService, Tune } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-info-list',
    templateUrl: 'tune-info-list.component.html',
    styleUrls: ['tune-info-list.component.css']
})
export class TuneInfoListComponent {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }
}


