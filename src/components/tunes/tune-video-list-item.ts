import {Component, OnInit, DoCheck, Input} from 'angular2/core';

import {TuneBookService} from '../../services/tunebook-service';
import {Video} from '../../business/model/video';
import {Tune} from '../../business/model/tune';


@Component({
    selector: 'tune-video-list-item',
    templateUrl: './components/tunes/tune-video-list-item.html',
    styleUrls: ['./components/tunes/tune-video-list-item.css']
})
export class TuneVideoListItemUI implements OnInit, DoCheck {
    @Input() video: Video;
    @Input() tune: Tune;
    videoUrl: string;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.videoUrl = this.getVideoUrl();
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.videoUrl = this.getVideoUrl();
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
        this.tuneBookService.storeTuneBookAbc();
    }

    deleteVideo() {
        this.tuneBookService.deleteVideo(this.tune.intTuneId, this.video.source, this.video.code);
    }
}


