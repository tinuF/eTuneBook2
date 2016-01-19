import {Component, Input} from 'angular2/core';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {PlaylistTuneDotsUI} from '../../components/play-list-tune-dots/play-list-tune-dots';



@Component({
    selector: 'etb-play-list-tune',
    templateUrl: './components/play-list-tune/play-list-tune.html',
    styleUrls: ['./components/play-list-tune/play-list-tune.css'],
    directives: [PlaylistTuneDotsUI]
})
export class PlaylistTuneUI {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }
}

