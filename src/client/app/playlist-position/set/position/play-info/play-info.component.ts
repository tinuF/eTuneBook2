import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';

import { TuneBookService, TuneSetPositionPlayInfo, PartPlayInfo, ACTION } from '../../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-play-info',
    templateUrl: 'play-info.component.html',
    styleUrls: ['play-info.component.css']
})
export class PlayInfoComponent implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    @ViewChild('inputTuneSetPositionAnnotation') inputTuneSetPositionAnnotation: ElementRef;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public renderer: Renderer) {

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

    handleKeyDownOnTuneSetPositionAnnotation(keyboardEvent: KeyboardEvent) {
        var keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputTuneSetPositionAnnotation.nativeElement, 'blur', []);
        }
    }

    handleBlurOnTuneSetPositionAnnotation(focusEvent: FocusEvent) {
       this.tuneBookService.storeTuneBookAbc();
    }

    addPartPlayInfo() {
        this.tuneSetPositionPlayInfo.addPartPlayInfo(new PartPlayInfo('', ''));
        this.tuneBookService.storeTuneBookAbc();
    }
}


