import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, TuneSetPositionPlayInfo, ACTION } from '../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-position-set-position',
    templateUrl: 'playlist-position-set-position.component.html',
    styleUrls: ['playlist-position-set-position.component.css']
})
export class PlayListPositionSetPositionComponent implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    @ViewChild('inputTuneSetPositionPlayInfoRepeat') inputTuneSetPositionPlayInfoRepeat: ElementRef;
    playInfoAnnotationShown: boolean;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public renderer: Renderer) {

    }

    ngOnInit() {
        this.playInfoAnnotationShown = false;
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('playlist-position-set-position:actionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }


    handleKeyDownOnTuneSetPositionPlayInfoRepeat(keyboardEvent: KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputTuneSetPositionPlayInfoRepeat.nativeElement, 'blur', []);
        }
    }

    handleBlurOnTuneSetPositionPlayInfoRepeat(focusEvent: FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }
}


