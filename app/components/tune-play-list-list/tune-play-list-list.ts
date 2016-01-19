import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {Playlist} from '../../business/model/playlist';
import {PlaylistListItemUI} from '../../components/play-list-list-item/play-list-list-item';


@Component({
    selector: 'etb-tune-play-list-list',
    inputs: ['tune'],
    templateUrl: './components/tune-play-list-list/tune-play-list-list.html',
    directives: [ROUTER_DIRECTIVES, PlaylistListItemUI],
    styleUrls: ['./components/tune-play-list-list/tune-play-list-list.css']
})
export class TunePlaylistListUI {
    tune: Tune;
    playlists: Array<Playlist>;

    constructor(public tuneBookService: TuneBookService) {

    }

    onInit() {
        this.playlists = this.tuneBookService.getPlaylistsByIntTuneId(this.tune.intTuneId);
    }
}


