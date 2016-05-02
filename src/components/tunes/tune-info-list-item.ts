import {Component, OnInit, DoCheck, Input, ViewChild, ElementRef, Renderer} from 'angular2/core';

import {TuneBookService} from '../../services/tunebook-service';
import {Website} from '../../business/model/website';
import {Tune} from '../../business/model/tune';


@Component({
    selector: 'tune-info-list-item',
    templateUrl: './components/tunes/tune-info-list-item.html',
    styleUrls: ['./components/tunes/tune-info-list-item.css']
})
export class TuneInfoListItemUI implements OnInit, DoCheck {
    @Input() website: Website;
    @Input() tune: Tune;
    @ViewChild('inputWebsiteUrl') inputWebsiteUrl: ElementRef;
    videoUrl: string;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, public renderer: Renderer) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    handleKeyDownOnWebsiteUrl(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputWebsiteUrl.nativeElement, 'blur', []);
        }
    }

    handleBlurOnWebsiteUrl(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }

    deleteInfo() {
        this.tuneBookService.deleteWebsite(this.tune.id, this.website.url);
    }
}


