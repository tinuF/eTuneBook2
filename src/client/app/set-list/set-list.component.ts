import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

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
    modelActionSubscription: Subscription;
    isRendering: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router) {
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

        this.modelActionSubscription = this.tuneBookService.modelActionObservable.subscribe(
            (action) => {
                //console.log('tune-list:modelActionSubscription called: ' + action);

                if (action === ACTION.IMPORT_TUNEBOOK ||
                    action === ACTION.LOAD_EXAMPLE_TUNEBOOK ||
                    action === ACTION.INITIALIZE_TUNEBOOK ||
                    action === ACTION.DELETE_TUNE) {

                    this.sets = this.tuneBookService.getTuneSetsFiltered();
                }
            });
        //console.log('set-list:ngOnInit called');
    }

    ngAfterViewInit() {
        this.isRendering = false;
        //setTimeout(() => this.cdr.reattach());
        this.tuneBookService.isRendered();

        /* Ersetzt durch Speicherung der Scroll-Position pro Route auf App-Ebene 
        setTimeout(() => {
            const tree = this.router.parseUrl(this.router.url);
            if (tree.fragment) {
                // you can use DomAdapter
                const element = document.querySelector('#set' + tree.fragment);
                if (element) {
                    //element.scrollIntoView();
                    const elementRect = element.getBoundingClientRect();
                    const absoluteElementTop = elementRect.top + window.pageYOffset;
                    const middle = absoluteElementTop - (window.innerHeight / 2);
                    window.scrollTo(0, middle);
                }
            }
        }, 0);
        */

        //console.log('set-list:ngAfterViewInit called');
    }

    ngOnDestroy() {
        this.filterActionSubscription.unsubscribe();
    }
}


