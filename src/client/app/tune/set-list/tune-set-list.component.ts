import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, Tune, TuneSet, ACTION } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-tune-set-list',
    templateUrl: 'tune-set-list.component.html',
    styleUrls: ['tune-set-list.component.css']
})
export class TuneSetListComponent implements OnInit, OnChanges, OnDestroy {
    @Input() tune: Tune;
    sets: Array<TuneSet>;
    modelActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.sets = this.tuneBookService.getTuneSetsByTuneId(this.tune.id);

        this.modelActionSubscription = this.tuneBookService.modelActionObservable.subscribe(
            (action) => {
                //console.log('tune-set-list:modelActionSubscription called: ' + action);
                if (action === ACTION.ADD_TUNESET || action === ACTION.DELETE_TUNESETPOSITION) {
                    this.sets = this.tuneBookService.getTuneSetsByTuneId(this.tune.id);
                }
            });
    }

    ngOnChanges() {
        this.sets = this.tuneBookService.getTuneSetsByTuneId(this.tune.id);
    }

    ngOnDestroy() {
        this.modelActionSubscription.unsubscribe();
    }
}


