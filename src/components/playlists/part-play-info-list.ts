import {Component, Input, OnInit, DoCheck} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {PartPlayInfo} from '../../business/model/partplayinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';

@Component({
    selector: 'etb-part-play-info-list',
    templateUrl: './components/playlists/part-play-info-list.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['./components/playlists/part-play-info-list.css'],
    pipes: [EliminateThe, FromNow]
})
export class PartPlayInfoListUI implements OnInit, DoCheck {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    handleKeyDownOnPart(event, partPlayInfo) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnPart(event, partPlayInfo);
        }
    }

    handleBlurOnPart(event, partPlayInfo) {
        partPlayInfo.part = event.target.value;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPartPlayInfo(event, partPlayInfo) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnPartPlayInfo(event, partPlayInfo);
        }
    }

    handleBlurOnPartPlayInfo(event, partPlayInfo) {
        partPlayInfo.playInfo = event.target.value;
        this.tuneBookService.storeTuneBookAbc();
    }

    deletePartPlayInfo(event, tuneSetPositionPlayInfo, partPlayInfo) {
        tuneSetPositionPlayInfo.deletePartPlayInfo(partPlayInfo);
        this.tuneBookService.storeTuneBookAbc();
    }

    addPartPlayInfoBefore(event, tuneSetPositionPlayInfo: TuneSetPositionPlayInfo, partPlayInfo: PartPlayInfo) {
        tuneSetPositionPlayInfo.addPartPlayInfoBefore(new PartPlayInfo("", ""), partPlayInfo);
        this.tuneBookService.storeTuneBookAbc();
    }

    addPartPlayInfoAfter(event, tuneSetPositionPlayInfo: TuneSetPositionPlayInfo, partPlayInfo: PartPlayInfo) {
        tuneSetPositionPlayInfo.addPartPlayInfoAfter(new PartPlayInfo("", ""), partPlayInfo);
        this.tuneBookService.storeTuneBookAbc();
    }
}


