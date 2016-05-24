import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { TuneBookService, Tune } from '../../business/index';
import { EliminateThePipe, SampleDotsComponent, TunePlayedComponent } from '../../shared/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-list-item',
    templateUrl: 'tune-list-item.component.html',
    directives: [ROUTER_DIRECTIVES, SampleDotsComponent, TunePlayedComponent],
    styleUrls: ['tune-list-item.component.css'],
    pipes: [EliminateThePipe]
})
export class TuneListItemComponent  {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }
}


