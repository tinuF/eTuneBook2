import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TuneBookService, Playlist, PlaylistPosition } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-position-copier',
    templateUrl: 'playlist-position-copier.component.html',
    styleUrls: ['playlist-position-copier.component.css']
})
export class PlayListPositionCopierComponent implements OnInit {
    @Input() playlistPosition: PlaylistPosition;
    playlists: Array<Playlist>;
    selectedPlaylist: Playlist;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.playlists = this.tuneBookService.getPlaylists();
        //console.log('playlist-position-copier:ngOnInit called');
    }

    setSelectedPlaylistId(playlist: Playlist) {
        this.selectedPlaylist = playlist;
    }

    copyPlaylistPosition() {
        this.tuneBookService.copyPlaylistPositionToOtherPlaylist(this.playlistPosition.playlistId,
            this.playlistPosition.position, this.selectedPlaylist.id);
        this.tuneBookService.storeTuneBookAbc();
        this.router.navigate(['/playlist', this.selectedPlaylist.id ]);
    };
}


