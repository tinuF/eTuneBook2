import {Component, OnInit, DoCheck} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, RouteParams, Location} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {FromNow} from '../../pipes/from-now';
import {TuneMenuUI} from '../tune-menu/tune-menu';
import {TuneDotsMenuUI} from '../tune-dots-menu/tune-dots-menu';
import {TuneDotsUI} from '../tune-dots/tune-dots';
import {TunePlayedUI} from '../tune-played/tune-played';
import {TuneVideoListUI} from '../tune-video-list/tune-video-list';
import {TuneSetListUI} from '../tune-set-list/tune-set-list';
import {TunePlaylistListUI} from '../tune-play-list-list/tune-play-list-list';



@Component({
    selector: 'tune',
    templateUrl: './components/tune/tune.html',
    styleUrls: ['./components/tune/tune.css'],
    directives: [ROUTER_DIRECTIVES, TuneMenuUI, TuneDotsMenuUI, TuneDotsUI, TunePlayedUI, TuneVideoListUI, TuneSetListUI, TunePlaylistListUI],
    pipes: [FromNow]
})
export class TuneUI implements OnInit, DoCheck {
    tune: Tune;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router, routeParams: RouteParams, public location: Location) {
        this.tune = this.tuneBookService.setCurrentTune(routeParams.get('id'));
    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
    }
}

