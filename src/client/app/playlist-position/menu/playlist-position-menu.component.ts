import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TuneBookService, PlaylistPosition, PlaylistSettings } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-position-menu',
    templateUrl: 'playlist-position-menu.component.html',
    styleUrls: ['playlist-position-menu.component.css'],
})
export class PlayListPositionMenuComponent implements OnInit {
    @Input() playlistPosition: PlaylistPosition;
    playlistSettings: PlaylistSettings;
    numberOfBars: string;
    numberOfBarOptions: Array<string> = ['4', '8', '*'];

    constructor(public tuneBookService: TuneBookService, public router: Router) {
        this.playlistSettings = this.tuneBookService.getCurrentPlaylistSettings();
    }

    ngOnInit() {
        this.numberOfBars = this.playlistSettings.getNumberOfBars();
    }

    forward() {
        let nextPosition = this.playlistPosition.position;

        nextPosition++;

        if (nextPosition > this.tuneBookService.getPlaylistPositions(this.playlistPosition.playlistId).length) {
            nextPosition = 1;
        }

        this.router.navigate(['/playlist', this.playlistPosition.playlistId, 'position', nextPosition]);
    }

    backward() {
        let previousPosition = this.playlistPosition.position;

        previousPosition--;

        if (previousPosition === 0) {
            previousPosition = this.tuneBookService.getPlaylistPositions(this.playlistPosition.playlistId).length;
        }

        this.router.navigate(['/playlist', this.playlistPosition.playlistId, 'position', previousPosition]);
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


