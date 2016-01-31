import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Video} from '../../business/model/video';


@Component({
    selector: 'tune-video-list-item',
    inputs: ['video: video'],
    templateUrl: './components/tune-video-list-item/tune-video-list-item.html',
    styleUrls: ['./components/tune-video-list-item/tune-video-list-item.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class TuneVideoListItemUI implements OnInit {
    video: Video;
    videoUrl: string;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.videoUrl = this.getVideoUrl();
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.editModus = this.tuneBookService.isEditModus();
    }

    getVideoUrl() {
        return "//www.youtube.com/embed/" + this.video.code;
    }

    handleKeyDownOnVideoCode(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnVideoCode(event);
        }
    }

    handleBlurOnVideoCode(event) {
        this.video.code = event.target.value;
        this.tuneBookService.storeTuneBookAbc();
    }
    
    handleKeyDownOnVideoDescription(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnVideoDescription(event);
        }
    }

    handleBlurOnVideoDescription(event) {
        this.video.description = event.target.value;
        this.tuneBookService.storeTunseBookAbc();
    }
}


