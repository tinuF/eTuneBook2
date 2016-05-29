import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnActivate, RouteSegment } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, Tune, ACTION} from '../business/index';
import { TunePlayedComponent} from '../shared/tune/tune-played.component';
import { TuneMenuComponent } from './menu/tune-menu.component';
import { TuneDotsComponent } from './dots/tune-dots.component';
import { TuneVideoListComponent } from './video-list/tune-video-list.component';
import { TuneInfoListComponent } from './info-list/tune-info-list.component';
import { TuneSetListComponent} from './set-list/tune-set-list.component';

@Component({
    moduleId: module.id,
    selector: 'etb-tune',
    templateUrl: 'tune.component.html',
    styleUrls: ['tune.component.css'],
    directives: [TuneMenuComponent,TuneDotsComponent, TunePlayedComponent,
        TuneVideoListComponent, TuneInfoListComponent, TuneSetListComponent],
})
export class TuneComponent implements OnInit, OnActivate, OnDestroy {
    tune: Tune;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {
        console.log('tune:constructor called');
    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('tune:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    routerOnActivate(currRouteSegment: RouteSegment) {
        this.tune = this.tuneBookService.getTune(parseInt(currRouteSegment.getParam('id')));
    }
}

