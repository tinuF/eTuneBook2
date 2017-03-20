import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, Renderer } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, Website, Tune, ACTION } from '../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'tune-info-list-item',
    templateUrl: 'tune-info-list-item.component.html',
    styleUrls: ['tune-info-list-item.component.css']
})
export class TuneInfoListItemComponent implements OnInit, OnDestroy {
    @Input() website: Website;
    @Input() tune: Tune;
    @ViewChild('inputWebsiteUrl') inputWebsiteUrl: ElementRef;
    videoUrl: string;
    editModus: boolean;
    modusActionSubscription: Subscription;
    confirmDeleteInfo: boolean;

    constructor(public tuneBookService: TuneBookService, public renderer: Renderer) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.confirmDeleteInfo = false;
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('tune-info-list-item:actionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    handleKeyDownOnWebsiteUrl(keyboardEvent: KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputWebsiteUrl.nativeElement, 'blur', []);
        }
    }

    handleBlurOnWebsiteUrl(focusEvent: FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }

    deleteInfo() {
        this.tuneBookService.deleteWebsite(this.tune.id, this.website.url);
    }
}


