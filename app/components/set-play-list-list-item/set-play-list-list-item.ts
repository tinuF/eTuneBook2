import {Component, ElementRef, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {EliminateThe} from '../../pipes/eliminate-the';


@Component({
    selector: 'etb-set-play-list-list-item',
    inputs: ['playlist'],
    templateUrl: './components/set-play-list-list-item/set-play-list-list-item.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['./components/set-play-list-list-item/set-play-list-list-item.css'],
    pipes: [EliminateThe]
})
export class SetPlaylistListItemUI implements OnInit {
    playlist: Playlist;

    constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {

    }

    ngOnInit() {
        //needs jQuery UI
        //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
    }


}


