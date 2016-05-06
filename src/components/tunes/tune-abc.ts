import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';

import {TuneAbcMenuUI} from '../tunes/tune-abc-menu';
import {TuneAbcEditorUI} from '../tunes/tune-abc-editor';
import {TunePlayedUI} from '../common/tune-played';



@Component({
    selector: 'tune-abc',
    templateUrl: './components/tunes/tune-abc.html',
    styleUrls: ['./components/tunes/tune-abc.css'],
    directives: [TuneAbcMenuUI, TunePlayedUI, TuneAbcEditorUI]
})
export class TuneAbcUI  {
    tune: Tune;
    tuneEditModus: boolean;
    noteEditModus: boolean;
    abcEditor: string;

    constructor(public tuneBookService: TuneBookService, public router: Router, routeParams: RouteParams) {
        this.tune = this.tuneBookService.getTune(parseInt(routeParams.get('id')));
    }
}