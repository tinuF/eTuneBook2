import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, Tune, ACTION } from '../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune',
    templateUrl: 'tune.component.html',
    styleUrls: ['tune.component.css']
})
export class TuneComponent implements OnInit, OnDestroy {
    tune: Tune;
    editModus: boolean;
    modusActionSubscription: Subscription;
    routerSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router, public route: ActivatedRoute) {
        //console.log('tune:constructor called');
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

        this.routerSubscription = this.route
            .params
            .subscribe(params => {
                let id = +params['id'];
                this.tune = this.tuneBookService.getTune(id);
            });

        window.scrollTo(0, 0);
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
        this.routerSubscription.unsubscribe();
        //console.log('tune:ngOnDestroy called:');
    }
}

