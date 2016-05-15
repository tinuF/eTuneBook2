import {Component, OnInit, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, RouteParams, Location} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {Tune} from '../../business/model/tune';
import {FromNow} from '../../pipes/from-now';
import {TuneMenuUI} from '../tune/tune-menu';
import {TuneDotsMenuUI} from '../tune/tune-dots-menu';
import {TuneDotsUI} from '../tune/tune-dots';
import {TunePlayedUI} from '../common/tune/tune-played';
import {TuneVideoListUI} from '../tune/tune-video-list';
import {TuneInfoListUI} from '../tune/tune-info-list';
import {TuneSetListUI} from '../tune/tune-set-list';



@Component({
    selector: 'tune',
    templateUrl: './components/tune/tune.html',
    styleUrls: ['./components/tune/tune.css'],
    directives: [ROUTER_DIRECTIVES, TuneMenuUI, TuneDotsMenuUI, TuneDotsUI, TunePlayedUI, TuneVideoListUI, TuneInfoListUI,
    TuneSetListUI],
    pipes: [FromNow]
})
export class TuneUI implements OnInit, OnDestroy {
    tune: Tune;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router, routeParams: RouteParams, public location: Location) {
        this.tune = this.tuneBookService.getTune(parseInt(routeParams.get('id')));
    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("tune:modusActionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }
}

