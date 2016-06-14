import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, TuneSet, ACTION } from '../business/index';
import { SetListItemComponent } from '../shared/set/set-list-item.component';
import { SetListMenuComponent } from './menu/set-list-menu.component';

@Component({
    moduleId: module.id,
    selector: 'etb-set-list',
    templateUrl: 'set-list.component.html',
    directives: [SetListItemComponent, SetListMenuComponent],
    styleUrls: ['set-list.component.css']
})
export class SetListComponent implements OnInit, OnDestroy {
    sets: Array<TuneSet>;
    filterActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {
        //console.log('set-list:constructor called');
    }

    ngOnInit() {
        // we need to detach the change detector initially, to prevent a
        // 'changed after checked' error.

        //TODO: Spinner-Logik läuft auf eine Exception
        //Aktueller Zone-Bug: https://github.com/angular/angular/issues/7721

        //this.cdr.detach();
        //this.isRendering = true;
        this.sets = this.tuneBookService.getTuneSetsFiltered();

        this.filterActionSubscription = this.tuneBookService.filterActionObservable.subscribe(
            (action) => {
                //console.log('set-list:filterActionSubscription called: ' + action);
                if (action === ACTION.APPLY_FILTER) {
                    this.sets = this.tuneBookService.getTuneSetsFiltered();
                }
            });
        //console.log('set-list:ngOnInit called');
    }

    ngOnDestroy() {
        this.filterActionSubscription.unsubscribe();
    }
}


