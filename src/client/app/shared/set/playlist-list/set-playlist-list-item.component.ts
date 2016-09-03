import { Component, Input, OnInit } from '@angular/core';

import { TuneBookService, TuneSet, Playlist, PlaylistPosition } from '../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-set-playlist-list-item',
    templateUrl: 'set-playlist-list-item.component.html',
    styleUrls: ['set-playlist-list-item.component.css']
})
export class SetPlaylistListItemComponent implements OnInit {
    @Input() playlist: Playlist;
    @Input() set: TuneSet;
    playlistPosition: PlaylistPosition;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
       this.playlistPosition = this.tuneBookService.getPlaylistPositionByTuneSetId(this.playlist.id, this.set.id);
    }
}


