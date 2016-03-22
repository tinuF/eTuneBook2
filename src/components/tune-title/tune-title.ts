import {Component, DoCheck} from 'angular2/core';
import {Location} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {EliminateThe} from '../../pipes/eliminate-the';


@Component({
    selector: 'tune-title',
    templateUrl: './components/tune-title/tune-title.html',
    styleUrls: ['./components/tune-title/tune-title.css'],
    pipes: [EliminateThe]
})
export class TuneTitleUI implements DoCheck {
    tune: Tune;
    tuneTitle: string;
    path: string;

    constructor(public tuneBookService: TuneBookService, public location: Location) {
        //not supported yet: one route and two components which are not tightly coupled.
        //this.tune = this.tuneBookService.getTune(routeParams.get('id'));
        this.setTuneTitle();
    }


    ngDoCheck() {
        this.setTuneTitle();
    }

    setTuneTitle() {
        this.path = this.location.path();
        this.tuneTitle = "";

        if (this.path.indexOf('/tunes/', 0) >= 0) {
            this.tune = this.tuneBookService.getCurrentTune();
            if (this.tune !== null) {
                this.tuneTitle = this.tune.title;
            }
        }
    }
}
