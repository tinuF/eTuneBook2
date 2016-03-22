import {Component, Input} from 'angular2/core';
import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {PlaylistTuneDotsUI} from '../../components/playlist-tune-dots/playlist-tune-dots';



@Component({
    selector: 'etb-playlist-tune',
    templateUrl: './components/playlist-tune/playlist-tune.html',
    styleUrls: ['./components/playlist-tune/playlist-tune.css'],
    directives: [PlaylistTuneDotsUI]
})
export class PlaylistTuneUI {
    @Input() tune: Tune;

    constructor(public tuneBookService: TuneBookService) {

    }
}

