import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';

import { TuneBookService, TuneSetPositionPlayInfo, PartPlayInfo, ACTION } from '../business/index';
import { PartPlayInfoListComponent } from '../+playlist-position/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-position-set-position-play-info',
    templateUrl: 'playlist-position-set-position-play-info.component.html',
    directives: [PartPlayInfoListComponent],
    styleUrls: ['playlist-position-set-position-play-info.component.css']
})
export class PlayListPositionSetPositionPlayInfoComponent implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('playlist-position-set-position-play-info:modusActionSubscription called: ' + action);
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

    handleBlurOnTuneSetPositionRepeat(focusEvent: FocusEvent) {
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

    handleBlurOnTuneSetPositionAnnotation(focusEvent: FocusEvent) {
        this.tuneSetPositionPlayInfo.annotation = (<HTMLInputElement>focusEvent.target).value;
        this.tuneBookService.storeTuneBookAbc();
    }

    addPartPlayInfo() {
        this.tuneSetPositionPlayInfo.addPartPlayInfo(new PartPlayInfo('', ''));
        this.tuneBookService.storeTuneBookAbc();
    }
}


