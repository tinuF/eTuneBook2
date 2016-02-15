import {Component, Input, OnInit, DoCheck} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {Playlist} from '../../business/model/playlist';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {TuneDotsUI} from '../tune-dots/tune-dots';
import {SampleDotsUI} from '../../components/sample-dots/sample-dots';
import {PlaylistTuneUI} from '../../components/playlist-tune/playlist-tune';
import {TunePlayedUI} from '../tune-played/tune-played';
import {SetListItemUI} from '../../components/set-list-item/set-list-item';
import {PartPlayInfoListUI} from '../../components/part-play-info-list/part-play-info-list';
import {PlayListItemSetPositionUI} from '../../components/playlist-item-set-position/playlist-item-set-position';
import {PlayListPositionSetPositionPlayInfoUI} from '../../components/playlist-position-set-position-play-info/playlist-position-set-position-play-info';


@Component({
    selector: 'etb-playlist-item',
    templateUrl: './components/playlist-item/playlist-item.html',
    directives: [ROUTER_DIRECTIVES, TuneDotsUI, SampleDotsUI, TunePlayedUI, PlaylistTuneUI, SetListItemUI, PartPlayInfoListUI, PlayListItemSetPositionUI, PlayListPositionSetPositionPlayInfoUI],
    styleUrls: ['./components/playlist-item/playlist-item.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListItemUI implements OnInit, DoCheck {
    @Input() playlistPosition: PlaylistPosition;
    editModus: boolean;
    positions: Array<number>;
    playlists: Array<Playlist>;
    selectedPlaylistId: number;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.tuneBookService.initializeTuneSetPositionPlayInfosForPlaylist(this.playlistPosition.playlistId);
        this.sortSetPosition();
        this.setPositions();
        this.editModus = this.tuneBookService.isEditModus();
        this.playlists = this.tuneBookService.getPlaylists();
    }

    ngDoCheck() {
        this.setPositions();
        this.editModus = this.tuneBookService.isEditModus();
    }

    sortSetPosition() {
        this.playlistPosition.tuneSet.tuneSetPositions.sort(function(a: TuneSetPosition, b: TuneSetPosition) {
            return a.position - b.position;
        });
    }

    handleKeyDownOnPlaylistPositionName(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnPlaylistPositionName(event);
        }
    }

    handleBlurOnPlaylistPositionName(event) {
        this.playlistPosition.name = event.target.value;
        this.tuneBookService.storeTuneBookAbc();
    }

    setPositions() {
        this.positions = this.tuneBookService.getPlaylistPositionsAsNumbers(this.playlistPosition.playlistId);
    }

    setPosition(e) {
        let oldPosition: number = this.playlistPosition.position;
        let newPosition: number = parseInt(e.target.value);

        if (oldPosition != newPosition) {
            this.tuneBookService.movePlaylistPosition(this.playlistPosition.playlistId, oldPosition, newPosition);
            this.tuneBookService.storeTuneBookAbc();
        }
    }

    setSelectedPlaylistId(e) {
        this.selectedPlaylistId = e.target.value;
    }

    copyPlaylistPosition() {
        this.tuneBookService.copyPlaylistPositionToOtherPlaylist(this.playlistPosition.playlistId, this.playlistPosition.position, this.selectedPlaylistId);
        this.tuneBookService.storeTuneBookAbc();
        this.router.navigate(['/Playlist', { id: this.selectedPlaylistId }]);
    };


    deletePlaylistPosition(e) {
        this.tuneBookService.deletePlaylistPosition(this.playlistPosition.playlistId, this.playlistPosition.position);
        this.tuneBookService.storeTuneBookAbc();
    }

    justPlayedTheSet() {
        var now = new Date();
        this.tuneBookService.addTuneSetPlayDate(this.playlistPosition.tuneSet, now);
        this.tuneBookService.storeTuneBookAbc();
    }
}


