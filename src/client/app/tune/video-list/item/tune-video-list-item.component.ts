import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

import { Subscription }   from 'rxjs/Subscription';

import { TuneBookService, Tune, Video, ACTION } from '../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'tune-video-list-item',
    templateUrl: 'tune-video-list-item.component.html',
    styleUrls: ['tune-video-list-item.component.css']
})
export class TuneVideoListItemComponent implements OnInit, OnDestroy {
    @Input() video: Video;
    @Input() tune: Tune;
    @ViewChild('inputVideoCode') inputVideoCode: ElementRef;
    @ViewChild('inputVideoDescription') inputVideoDescription: ElementRef;
    videoUrl: SafeResourceUrl;
    editModus: boolean;
    modusActionSubscription: Subscription;
    confirmDeleteVideo: boolean;

    constructor(public tuneBookService: TuneBookService, public renderer: Renderer, public sanitationService: DomSanitizer) {

    }

    ngOnInit() {
        this.setVideoUrl();
        this.editModus = this.tuneBookService.isEditModus();
        this.confirmDeleteVideo = false;

        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('tune-video-list-item:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    setVideoUrl() {
        let videoUrlString: string = '//www.youtube.com/embed/' + this.video.code;
        this.videoUrl = this.sanitationService.bypassSecurityTrustResourceUrl(videoUrlString);
    }

    handleKeyDownOnVideoCode(keyboardEvent: KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputVideoCode.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputVideoDescription.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputVideoDescription.nativeElement, 'select', []);
        }
    }

    handleBlurOnVideoCode(focusEvent: FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
        this.setVideoUrl();
    }

    handleKeyDownOnVideoDescription(keyboardEvent: KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputVideoDescription.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputVideoCode.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputVideoCode.nativeElement, 'select', []);
        }
    }

    handleBlurOnVideoDescription(focusEvent: FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }

    deleteVideo() {
        this.tuneBookService.deleteVideo(this.tune.id, this.video.source, this.video.code);
    }
}


