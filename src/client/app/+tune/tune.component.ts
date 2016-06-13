import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    directives: [TuneMenuComponent, TuneDotsComponent, TunePlayedComponent,
        TuneVideoListComponent, TuneInfoListComponent, TuneSetListComponent],
})
export class TuneComponent implements OnInit, OnDestroy {
    tune: Tune;
    editModus: boolean;
    modusActionSubscription: Subscription;
    routerSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router, public route: ActivatedRoute) {
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

        this.routerSubscription = this.route
            .params
            .subscribe(params => {
                let id = +params['id'];
                this.tune = this.tuneBookService.getTune(id);
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
        this.routerSubscription.unsubscribe();
        //console.log('tune:ngOnDestroy called:');
    }
}

