import {Component, OnInit, OnDestroy, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {TuneSet} from '../../business/model/tuneset';

import {SetListItemUI} from '../../components/sets/set-list-item';


@Component({
    selector: 'etb-tune-set-list',
    templateUrl: './components/tunes/tune-set-list.html',
    styleUrls: ['./components/tunes/tune-set-list.css'],
    directives: [ROUTER_DIRECTIVES, SetListItemUI]
})
export class TuneSetListUI implements OnInit, OnDestroy {
    @Input() tune: Tune;
    sets: Array<TuneSet>;
    modelChangeSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.sets = this.tuneBookService.getTuneSetsByTuneId(this.tune.id);
        
        this.modelChangeSubscription = this.tuneBookService.modelChangeObservable.subscribe(
            (method) => {
                console.log("tune-set-list:ngOnInit-Subscription called: " + method);
                if (method === "initializeTuneSet" || method === "deleteTune") {
                    this.sets = this.tuneBookService.getTuneSetsByTuneId(this.tune.id);
                }
            });
    }

    ngOnDestroy() {
        this.modelChangeSubscription.unsubscribe();
    }

    /*
        ngDoCheck() {
            this.sets = this.tuneBookService.getTuneSetsByTuneId(this.tune.id);
            console.log("tune-set-list:ngDoCheck called");
            //wenn ein Set hinzukommt oder wegfällt, muss die Liste angepasst werden
            //angular reagiert auf das Tune im @Input nur bei geänderter Referenz 
            //Problem: Das Rendern durch ABCJS (nur bei Init) löst hunderte asynchrone Events aus
            //(abhängig von der Länge des Tunes), 
            //die jedes mal dazu führen, dass ngDoCheck ausgeführt wird.
        }
        */
}


