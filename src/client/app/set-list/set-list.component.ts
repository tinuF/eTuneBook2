import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, TuneSet, ACTION } from '../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-set-list',
    templateUrl: 'set-list.component.html',
    styleUrls: ['set-list.component.css']
})
export class SetListComponent implements OnInit, AfterViewInit, OnDestroy {
    sets: Array<TuneSet>;
    filterActionSubscription: Subscription;
    isRendering: boolean;

    constructor(public tuneBookService: TuneBookService) {
        //console.log('set-list:constructor called');
    }

    ngOnInit() {
        // we need to detach the change detector initially, to prevent a
        // 'changed after checked' error.

        //this.cdr.detach();
        this.isRendering = true;
        // this.tuneBookService.isRendering() wird gebraucht, damit auf dieser Stufe cdr.detach() nicht nötig
        // warum ist unklar
        this.tuneBookService.isRendering();
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

    ngAfterViewInit() {
        this.isRendering = false;
        //setTimeout(() => this.cdr.reattach());
        this.tuneBookService.isRendered();
        //console.log('set-list:ngAfterViewInit called');
    }

    ngOnDestroy() {
        this.filterActionSubscription.unsubscribe();
    }
}


