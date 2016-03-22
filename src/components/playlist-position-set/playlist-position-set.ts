import {Component, Input, OnInit, DoCheck} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {TuneDotsUI} from '../tune-dots/tune-dots';
import {SampleDotsUI} from '../../components/sample-dots/sample-dots';
import {PlaylistTuneUI} from '../../components/playlist-tune/playlist-tune';
import {TunePlayedUI} from '../tune-played/tune-played';
import {SetListItemUI} from '../../components/set-list-item/set-list-item';
import {PartPlayInfoListUI} from '../../components/part-play-info-list/part-play-info-list';
import {PlayListPositionSetPositionUI} from '../../components/playlist-position-set-position/playlist-position-set-position';
import {PlayListPositionSetPositionPlayInfoUI} from '../../components/playlist-position-set-position-play-info/playlist-position-set-position-play-info';




@Component({
    selector: 'etb-playlist-position-set',
    templateUrl: './components/playlist-position-set/playlist-position-set.html',
    directives: [ROUTER_DIRECTIVES, TuneDotsUI, SampleDotsUI, TunePlayedUI, PlaylistTuneUI, SetListItemUI, PartPlayInfoListUI, PlayListPositionSetPositionUI, PlayListPositionSetPositionPlayInfoUI],
    styleUrls: ['./components/playlist-position-set/playlist-position-set.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListPositionSetUI implements OnInit, DoCheck {
    @Input() playlistPosition: PlaylistPosition;
    editModus: boolean;
    positions: Array<number>;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.tuneBookService.initializeTuneSetPositionPlayInfosForPlaylist(this.playlistPosition.playlistId);
        this.sortSetPosition();
        this.setPositions();
        this.editModus = this.tuneBookService.isEditModus();
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

    deletePlaylistPosition(e) {
        this.tuneBookService.deletePlaylistPosition(this.playlistPosition.playlistId, this.playlistPosition.position);
        this.tuneBookService.storeTuneBookAbc();
    };
}


