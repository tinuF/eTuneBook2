import {Component, Input, OnInit, ElementRef} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {PlayListItemSetPositionUI} from '../../components/playlist/playlist-item-set-position';


@Component({
    selector: 'etb-playlist-position-copier',
    templateUrl: './components/playlist/playlist-position-copier.html',
    directives: [ROUTER_DIRECTIVES, PlayListItemSetPositionUI],
    styleUrls: ['./components/playlist/playlist-position-copier.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListPositionCopierUI implements OnInit {
    @Input() playlistPosition: PlaylistPosition;
    playlists: Array<Playlist>;
    selectedPlaylist: Playlist;

    constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {

    }

    ngOnInit() {
        this.playlists = this.tuneBookService.getPlaylists();
        //jQuery(this.elementRef.nativeElement).show(); 
    }

    setSelectedPlaylistId(playlist:Playlist) {
        this.selectedPlaylist = playlist;
    }

    copyPlaylistPosition() {
        this.tuneBookService.copyPlaylistPositionToOtherPlaylist(this.playlistPosition.playlistId, this.playlistPosition.position, this.selectedPlaylist.id);
        this.tuneBookService.storeTuneBookAbc();
        this.router.navigate(['/Playlist', { id: this.selectedPlaylist.id }]);
    };
}


