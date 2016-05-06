import {Component, OnInit, DoCheck, OnDestroy, Input, ViewChild, ElementRef, Renderer} from 'angular2/core';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
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
    editModusSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public renderer: Renderer) {

    }
    
    ngOnInit() {
        this.videoUrl = this.getVideoUrl();
        this.editModus = this.tuneBookService.isEditModus();
        this.editModusSubscription = this.tuneBookService.editModusObservable.subscribe(
            editModus => this.editModus = editModus);
    }

    ngOnDestroy() {
        this.editModusSubscription.unsubscribe();
    }


    ngDoCheck() {
        this.videoUrl = this.getVideoUrl();
    }

    getVideoUrl() {
        return "//www.youtube.com/embed/" + this.video.code;
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


