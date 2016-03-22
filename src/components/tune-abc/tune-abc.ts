import {Component, OnInit, DoCheck} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';

import {TuneAbcMenuUI} from '../tune-abc-menu/tune-abc-menu';
import {TuneAbcEditorUI} from '../tune-abc-editor/tune-abc-editor';
import {TunePlayedUI} from '../tune-played/tune-played';



@Component({
    selector: 'tune-abc',
    templateUrl: './components/tune-abc/tune-abc.html',
    styleUrls: ['./components/tune-abc/tune-abc.css'],
    directives: [TuneAbcMenuUI, TunePlayedUI, TuneAbcEditorUI]
})
export class TuneAbcUI implements OnInit, DoCheck {
    tune: Tune;
    tuneEditModus: boolean;
    noteEditModus: boolean;
    abcEditor: string;

    constructor(public tuneBookService: TuneBookService, public router: Router, routeParams: RouteParams) {
        this.tune = this.tuneBookService.getTune(routeParams.get('id'));
    }

    ngOnInit() {
    }

    ngDoCheck() {

    }
}