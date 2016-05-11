import {Component, Input, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {EditButtonUI} from '../../components/common/edit-btn';
import {PlaylistSettings} from '../../common/settings/playlist-settings';


@Component({
    selector: 'etb-playlist-position-menu',
    templateUrl: './components/playlists/playlist-position-menu.html',
    directives: [EditButtonUI],
    styleUrls: ['./components/playlists/playlist-position-menu.css'],
})
export class PlayListPositionMenuUI implements OnInit {
    @Input() playlistPosition: PlaylistPosition;
    playlistSettings: PlaylistSettings;
    numberOfBars: string;
    numberOfBarOptions: Array<string> = ['*', '4', '8'];

    constructor(public tuneBookService: TuneBookService, public router: Router) {
        this.playlistSettings = this.tuneBookService.getCurrentPlaylistSettings();
    }

    ngOnInit() {
        this.numberOfBars = this.playlistSettings.getNumberOfBars();
    }

    forward() {
        //todo: playlistPosition.position ist an dieser Stelle fälschlicherweise ein String
        let nextPosition = this.playlistPosition.position;

        //nextPosition = parseInt(nextPosition);

        nextPosition++;

        if (nextPosition > this.tuneBookService.getPlaylistPositions(this.playlistPosition.playlistId).length) {
            nextPosition = 1;
        }

        this.router.navigate(['/PlaylistPosition', { id: this.playlistPosition.playlistId, pos: nextPosition }]);
    }

    backward() {
        //todo: playlistPosition.position ist an dieser Stelle fälschlicherweise ein String
        let previousPosition = this.playlistPosition.position;

        //previousPosition = parseInt(previousPosition);

        previousPosition--;

        if (previousPosition == 0) {
            previousPosition = this.tuneBookService.getPlaylistPositions(this.playlistPosition.playlistId).length;
        }

        this.router.navigate(['/PlaylistPosition', { id: this.playlistPosition.playlistId, pos: previousPosition }]);
    }

    toggleDots() {
        this.tuneBookService.toggleShowPlaylistDots();
    }
    
    changeNumberOfBars(numberOfBars: string) {
        this.numberOfBars = numberOfBars;
        this.playlistSettings.setNumberOfBars(numberOfBars);
        this.tuneBookService.changeNumberOfBarsOfPlaylistDots();
    }
}


