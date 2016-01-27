import {Component, Input, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {PartPlayInfo} from '../../business/model/partplayinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {TuneDotsUI} from '../tune-dots/tune-dots';
import {SampleDotsUI} from '../../components/sample-dots/sample-dots';
import {PlaylistTuneUI} from '../../components/play-list-tune/play-list-tune';
import {TunePlayedUI} from '../tune-played/tune-played';
import {SetListItemUI} from '../../components/set-list-item/set-list-item';
import {PartPlayInfoListUI} from '../../components/part-play-info-list/part-play-info-list';
import {PlayListPositionSetPositionPlayInfoUI} from '../../components/play-list-position-set-position-play-info/play-list-position-set-position-play-info';



@Component({
    selector: 'etb-play-list-position-set-position',
    templateUrl: './components/play-list-position-set-position/play-list-position-set-position.html',
    directives: [ROUTER_DIRECTIVES, TuneDotsUI, SampleDotsUI, TunePlayedUI, PlaylistTuneUI, SetListItemUI, PartPlayInfoListUI, PlayListPositionSetPositionPlayInfoUI],
    styleUrls: ['./components/play-list-position-set-position/play-list-position-set-position.css'],
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


