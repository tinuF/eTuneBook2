import {Component, Input, OnInit, DoCheck} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {PartPlayInfoListUI} from '../../components/playlists/part-play-info-list';



@Component({
    selector: 'etb-playlist-position-set-position-play-info',
    templateUrl: './components/playlists/playlist-position-set-position-play-info.html',
    directives: [ROUTER_DIRECTIVES, PartPlayInfoListUI],
    styleUrls: ['./components/playlists/playlist-position-set-position-play-info.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListPositionSetPositionPlayInfoUI implements OnInit, DoCheck {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    @Input() playInfoAnnotationShown: boolean;
    editModus:boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    handleKeyDownOnTuneSetPositionRepeat(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnTuneSetPositionRepeat(event);
        }
    }

    handleBlurOnTuneSetPositionRepeat(focusEvent:FocusEvent) {
        this.tuneSetPositionPlayInfo.repeat = (<HTMLInputElement>focusEvent.target).value;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnTuneSetPositionAnnotation(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnTuneSetPositionAnnotation(event);
        }
    }

    handleBlurOnTuneSetPositionAnnotation(focusEvent:FocusEvent) {
        this.tuneSetPositionPlayInfo.annotation = (<HTMLInputElement>focusEvent.target).value;
        this.tuneBookService.storeTuneBookAbc();
    }

    togglePlayInfoAnnotation() {
        this.playInfoAnnotationShown = !this.playInfoAnnotationShown;

    }
}


