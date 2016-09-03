import { Component, Input } from '@angular/core';

import { TuneBookService, Tune } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-list-item',
    templateUrl: 'tune-list-item.component.html',
    styleUrls: ['tune-list-item.component.css']
})
export class TuneListItemComponent  {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }
}


