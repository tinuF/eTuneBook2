import {Component, OnInit, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {TuneSet} from '../../business/model/tuneset';
import {SetListItemUI} from '../../components/common/set/set-list-item';
import {SetListMenuUI} from '../../components/set-list/set-list-menu';


@Component({
    selector: 'etb-set-list',
    templateUrl: './components/set-list/set-list.html',
    directives: [ROUTER_DIRECTIVES, SetListItemUI, SetListMenuUI],
    styleUrls: ['./components/set-list/set-list.css']
})
export class SetListUI implements OnInit, OnDestroy {
    sets: Array<TuneSet>;
    filterActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {
        
    }
    
    ngOnInit() {
        // we need to detach the change detector initially, to prevent a
        // "changed after checked" error.
        
        //TODO: Spinner-Logik läuft auf eine Exception
        //Aktueller Zone-Bug: https://github.com/angular/angular/issues/7721
        
        //this.cdr.detach();
        //this.isRendering = true;
        this.sets = this.tuneBookService.getTuneSetsFiltered();
        
        this.filterActionSubscription = this.tuneBookService.filterActionObservable.subscribe(
            (action) => {
                console.log("set-list:filterActionSubscription called: " + action);
                if (action === ACTION.APPLY_FILTER) {
                    this.sets = this.tuneBookService.getTuneSetsFiltered();
                }
            });
        console.log("set-list:ngOnInit called");
    }
    
    ngOnDestroy() {
        this.filterActionSubscription.unsubscribe();
    }
}


