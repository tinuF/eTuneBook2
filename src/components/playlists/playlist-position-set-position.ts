import {Component, Input, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {PartPlayInfo} from '../../business/model/partplayinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {PlaylistTuneUI} from '../../components/playlists/playlist-tune';
import {TunePlayedUI} from '../common/tune-played';
import {PlayListPositionSetPositionPlayInfoUI} from '../../components/playlists/playlist-position-set-position-play-info';



@Component({
    selector: 'etb-playlist-position-set-position',
    templateUrl: './components/playlists/playlist-position-set-position.html',
    directives: [ROUTER_DIRECTIVES, TunePlayedUI, PlaylistTuneUI, PlayListPositionSetPositionPlayInfoUI],
    styleUrls: ['./components/playlists/playlist-position-set-position.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListPositionSetPositionUI implements OnInit {
    @Input() tuneSetPosition: TuneSetPosition;
    playInfoAnnotationShown: boolean;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.playInfoAnnotationShown = false;
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    handleKeyDownOnTuneSetPositionRepeat(event, tuneSetPosition) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnTuneSetPositionRepeat(event, tuneSetPosition);
        }
    }

    handleBlurOnTuneSetPositionRepeat(event, tuneSetPosition) {
        tuneSetPosition.currentTuneSetPositionPlayInfo.repeat = event.target.value;
        this.tuneBookService.storeTuneBookAbc();
    }

    togglePlayInfoAnnotation() {
        this.playInfoAnnotationShown = !this.playInfoAnnotationShown;
    }

    addPartPlayInfo() {
        this.tuneSetPosition.currentTuneSetPositionPlayInfo.addPartPlayInfo(new PartPlayInfo("", ""));
        this.tuneBookService.storeTuneBookAbc();
    }

}

