import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';

import { TuneBookService, PartPlayInfo, ACTION } from '../../../../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-part-play-info-list-item',
    templateUrl: 'part-play-info-list-item.component.html',
    styleUrls: ['part-play-info-list-item.component.css'],
})
export class PartPlayInfoListItemComponent implements OnInit, OnDestroy {
    @Input() partPlayInfo: PartPlayInfo;
    @ViewChild('inputPart') inputPart: ElementRef;
    @ViewChild('inputPlayInfo') inputPlayInfo: ElementRef;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public renderer: Renderer) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('part-play-info-list:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    handleKeyDownOnPart(keyboardEvent: KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputPart.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPlayInfo.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlayInfo.nativeElement, 'select', []);
        }
    }

    handleBlurOnPart(focusEvent: FocusEvent) {
        //Replace : and , with - (: and , are used as separators and thus are not allowed)
        this.partPlayInfo.part = this.partPlayInfo.part.replace(/[:,]/g, '-');
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPartPlayInfo(keyboardEvent: KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputPlayInfo.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPart.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPart.nativeElement, 'select', []);
        }
    }

    handleBlurOnPartPlayInfo(focusEvent: FocusEvent) {
        //Replace : and , with - (: and , are used as separators and thus are not allowed)
        this.partPlayInfo.playInfo = this.partPlayInfo.playInfo.replace(/[:,]/g, '-');
        this.tuneBookService.storeTuneBookAbc();
    }
}


