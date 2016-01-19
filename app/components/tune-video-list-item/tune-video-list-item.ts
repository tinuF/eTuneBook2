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

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.videoUrl = this.getVideoUrl();
    }

    getVideoUrl() {
        return "//www.youtube.com/embed/" + this.video.code;
    }
}


