import { Component, Input } from '@angular/core';

import { TuneBookService, Tune } from '../../business/index';
import { TuneVideoListItemComponent } from './item/tune-video-list-item.component';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-video-list',
    templateUrl: 'tune-video-list.component.html',
    styleUrls: ['tune-video-list.component.css'],
    directives: [TuneVideoListItemComponent]
})
export class TuneVideoListComponent {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }
}


