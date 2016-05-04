import {Component, OnInit, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, RouteParams, Location} from 'angular2/router';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {FromNow} from '../../pipes/from-now';
import {TuneMenuUI} from '../tunes/tune-menu';
import {TuneDotsMenuUI} from '../tunes/tune-dots-menu';
import {TuneDotsUI} from '../tunes/tune-dots';
import {TunePlayedUI} from '../common/tune-played';
import {TuneVideoListUI} from '../tunes/tune-video-list';
import {TuneInfoListUI} from '../tunes/tune-info-list';
import {TuneSetListUI} from '../tunes/tune-set-list';
import {TunePlaylistListUI} from '../tunes/tune-playlist-list';



@Component({
    selector: 'tune',
    templateUrl: './components/tunes/tune.html',
    styleUrls: ['./components/tunes/tune.css'],
    directives: [ROUTER_DIRECTIVES, TuneMenuUI, TuneDotsMenuUI, TuneDotsUI, TunePlayedUI, TuneVideoListUI, TuneInfoListUI,
    TuneSetListUI, TunePlaylistListUI],
    pipes: [FromNow]
})
export class TuneUI implements OnInit, OnDestroy {
    tune: Tune;
    editModus: boolean;
    editModusSubscription: any;

    constructor(public tuneBookService: TuneBookService, public router: Router, routeParams: RouteParams, public location: Location) {
        this.tune = this.tuneBookService.getTune(parseInt(routeParams.get('id')));
    }

    ngOnInit() {
        this.editModusSubscription = this.tuneBookService.editModusChange$.subscribe(
            editModus => this.editModus = editModus);
    }

    ngOnDestroy() {
        this.editModusSubscription.unsubscribe();
    }
}

