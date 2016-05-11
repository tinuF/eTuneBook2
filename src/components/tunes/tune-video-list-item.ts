import {Component, OnInit, DoCheck, OnDestroy, Input, ViewChild, ElementRef, Renderer} from 'angular2/core';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {Video} from '../../business/model/video';
import {Tune} from '../../business/model/tune';


@Component({
    selector: 'tune-video-list-item',
    templateUrl: './components/tunes/tune-video-list-item.html',
    styleUrls: ['./components/tunes/tune-video-list-item.css']
})
export class TuneVideoListItemUI implements OnInit, OnDestroy, DoCheck {
    @Input() video: Video;
    @Input() tune: Tune;
    @ViewChild('inputVideoCode') inputVideoCode: ElementRef;
    @ViewChild('inputVideoDescription') inputVideoDescription: ElementRef;
    videoUrl: string;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public renderer: Renderer) {

    }
    
    ngOnInit() {
        this.setVideoUrl();
        this.editModus = this.tuneBookService.isEditModus();
        
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("tune-video-list-item:modusActionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    setVideoUrl() {
        this.videoUrl =  "//www.youtube.com/embed/" + this.video.code;
    }
    
    handleKeyDownOnVideoCode(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputVideoCode.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputVideoDescription.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputVideoDescription.nativeElement, 'select', []);
        }
    }

    handleBlurOnVideoCode(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
        this.setVideoUrl();
    }

    handleKeyDownOnVideoDescription(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputVideoDescription.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputVideoCode.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputVideoCode.nativeElement, 'select', []);
        }
    }

    handleBlurOnVideoDescription(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }

    deleteVideo() {
        this.tuneBookService.deleteVideo(this.tune.id, this.video.source, this.video.code);
    }
}


