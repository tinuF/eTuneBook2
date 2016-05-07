import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
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
export class PartPlayInfoListUI implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    editModus: boolean;
    actionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.actionSubscription = this.tuneBookService.actionObservable.subscribe(
            (action) => {
                console.log("part-play-info-list:actionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }
    
    ngOnDestroy() {
        this.actionSubscription.unsubscribe();
    }

    handleKeyDownOnPart(event, partPlayInfo:PartPlayInfo) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnPart(event, partPlayInfo);
        }
    }

    handleBlurOnPart(focusEvent:FocusEvent, partPlayInfo:PartPlayInfo) {
        partPlayInfo.part = (<HTMLInputElement>focusEvent.target).value;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPartPlayInfo(event, partPlayInfo:PartPlayInfo) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnPartPlayInfo(event, partPlayInfo);
        }
    }

    handleBlurOnPartPlayInfo(focusEvent:FocusEvent, partPlayInfo:PartPlayInfo) {
        partPlayInfo.playInfo = (<HTMLInputElement>focusEvent.target).value;
        this.tuneBookService.storeTuneBookAbc();
    }

    deletePartPlayInfo(event, tuneSetPositionPlayInfo, partPlayInfo:PartPlayInfo) {
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


