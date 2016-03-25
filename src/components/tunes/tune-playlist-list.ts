import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Tune} from '../../business/model/tune';
import {Playlist} from '../../business/model/playlist';
import {PlaylistListItemUI} from '../../components/playlists/playlist-list-item';


@Component({
    selector: 'etb-tune-playlist-list',
    templateUrl: './components/tunes/tune-playlist-list.html',
    directives: [ROUTER_DIRECTIVES, PlaylistListItemUI],
    styleUrls: ['./components/tunes/tune-playlist-list.css']
})
export class TunePlaylistListUI {
    @Input() tune: Tune;
    playlists: Array<Playlist>;

    constructor(public tuneBookService: TuneBookService) {

    }

    onInit() {
        this.playlists = this.tuneBookService.getPlaylistsByIntTuneId(this.tune.intTuneId);
    }
}

