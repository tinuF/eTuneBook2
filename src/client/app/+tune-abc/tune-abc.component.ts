import { Component } from '@angular/core';
import { OnActivate, RouteSegment } from '@angular/router';

import { TuneBookService, Tune } from '../business/index';
import { TunePlayedComponent } from '../shared/index';
import { TuneAbcMenuComponent, TuneAbcEditorComponent } from './shared/index';

@Component({
    moduleId: module.id,
    selector: 'tune-abc',
    templateUrl: 'tune-abc.component.html',
    styleUrls: ['tune-abc.component.css'],
    directives: [TuneAbcMenuComponent, TunePlayedComponent, TuneAbcEditorComponent]
})
export class TuneAbcComponent implements OnActivate {
    tune: Tune;
    tuneEditModus: boolean;
    noteEditModus: boolean;
    abcEditor: string;

    constructor(public tuneBookService: TuneBookService) {

    }

    routerOnActivate(currRouteSegment: RouteSegment) {
        this.tune = this.tuneBookService.getTune(parseInt(currRouteSegment.getParam('id')));
    }
}