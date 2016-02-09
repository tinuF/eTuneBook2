import {Component, Input, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {EditButtonUI} from '../../components/edit-btn/edit-btn';


@Component({
    selector: 'etb-playlist-position-menu',
    templateUrl: './components/playlist-position-menu/playlist-position-menu.html',
    directives: [EditButtonUI],
    styleUrls: ['./components/playlist-position-menu/playlist-position-menu.css'],
})
export class PlayListPositionMenuUI implements OnInit {
    @Input() playlistPosition: PlaylistPosition;

    constructor(public tuneBookService: TuneBookService, public router: Router) {
    }

    ngOnInit() {
    }

    forward() {
        //todo: playlistPosition.position ist an dieser Stelle fälschlicherweise ein String
        let nextPosition = this.playlistPosition.position;

        nextPosition = parseInt(nextPosition);

        nextPosition++;

        if (nextPosition > this.tuneBookService.getPlaylistPositions(this.playlistPosition.playlistId).length) {
            nextPosition = 1;
        }

        this.router.navigate(['/PlaylistPosition', { id: this.playlistPosition.playlistId, pos: nextPosition }]);
    }

    backward() {
        //todo: playlistPosition.position ist an dieser Stelle fälschlicherweise ein String
        let previousPosition = this.playlistPosition.position;

        previousPosition = parseInt(previousPosition);

        previousPosition--;

        if (previousPosition == 0) {
            previousPosition = this.tuneBookService.getPlaylistPositions(this.playlistPosition.playlistId).length;
        }

        this.router.navigate(['/PlaylistPosition', { id: this.playlistPosition.playlistId, pos: previousPosition }]);
    }

}


