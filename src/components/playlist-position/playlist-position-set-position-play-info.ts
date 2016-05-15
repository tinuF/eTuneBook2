import {Component, Input, OnInit, OnDestroy} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {PartPlayInfo} from '../../business/model/partplayinfo';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {PartPlayInfoListUI} from '../../components/playlist-position/part-play-info-list';



@Component({
    selector: 'etb-playlist-position-set-position-play-info',
    templateUrl: './components/playlist-position/playlist-position-set-position-play-info.html',
    directives: [ROUTER_DIRECTIVES, PartPlayInfoListUI],
    styleUrls: ['./components/playlist-position/playlist-position-set-position-play-info.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListPositionSetPositionPlayInfoUI implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    editModus:boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("playlist-position-set-position-play-info:modusActionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }
    
    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
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
    
    addPartPlayInfo() {
        this.tuneSetPositionPlayInfo.addPartPlayInfo(new PartPlayInfo("", ""));
        this.tuneBookService.storeTuneBookAbc();
    }
}


