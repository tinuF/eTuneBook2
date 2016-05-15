import {Component, OnInit, OnDestroy, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {Tune} from '../../business/model/tune';
import {TuneSet} from '../../business/model/tuneset';
import {SetListItemUI} from '../../components/common/set/set-list-item';


@Component({
    selector: 'etb-tune-set-list',
    templateUrl: './components/tune/tune-set-list.html',
    styleUrls: ['./components/tune/tune-set-list.css'],
    directives: [ROUTER_DIRECTIVES, SetListItemUI]
})
export class TuneSetListUI implements OnInit, OnDestroy {
    @Input() tune: Tune;
    sets: Array<TuneSet>;
    modelActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.sets = this.tuneBookService.getTuneSetsByTuneId(this.tune.id);
        
        this.modelActionSubscription = this.tuneBookService.modelActionObservable.subscribe(
            (action) => {
                console.log("tune-set-list:modelActionSubscription called: " + action);
                if (action === ACTION.ADD_TUNESET || action === ACTION.DELETE_TUNESETPOSITION) {
                    this.sets = this.tuneBookService.getTuneSetsByTuneId(this.tune.id);
                }
            });
    }

    ngOnDestroy() {
        this.modelActionSubscription.unsubscribe();
    }
}


