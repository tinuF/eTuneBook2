import {Component, OnInit, ViewChild, ElementRef, Renderer} from 'angular2/core';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneBook} from '../../business/model/tunebook';
import {ACTION} from '../../common/action';

@Component({
    selector: 'etb-book',
    templateUrl: './components/book/book.html',
    styleUrls: ['./components/book/book.css'],
})
export class BookUI implements OnInit {
    tuneBook: TuneBook;
    @ViewChild('inputTuneBookName') inputTuneBookName: ElementRef;
    @ViewChild('inputTuneBookVersion') inputTuneBookVersion: ElementRef;
    @ViewChild('inputTuneBookDescription') inputTuneBookDescription: ElementRef;

    constructor(public tuneBookService: TuneBookService, public renderer: Renderer) {

    }

    ngOnInit() {
        this.tuneBook = this.tuneBookService.getCurrentTuneBook();
    }

    handleKeyDownOnTuneBookName(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputTuneBookName.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputTuneBookVersion.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputTuneBookVersion.nativeElement, 'select', []);
        }
    }

    handleBlurOnTuneBookName(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbcAndBroadCastAction(ACTION.EDIT_TUNEBOOK_NAME);
    }
    
    handleKeyDownOnTuneBookVersion(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputTuneBookVersion.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputTuneBookDescription.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputTuneBookDescription.nativeElement, 'select', []);
        }
    }

    handleBlurOnTuneBookVersion(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbcAndBroadCastAction(ACTION.EDIT_TUNEBOOK_VERSION);
    }

    handleKeyDownOnTuneBookDescription(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputTuneBookDescription.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputTuneBookName.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputTuneBookName.nativeElement, 'select', []);
        }
    }

    handleBlurOnTuneBookDescription(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbcAndBroadCastAction(ACTION.EDIT_TUNEBOOK_DESCRIPTION);
    }
}
