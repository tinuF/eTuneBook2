import {Component, OnInit, DoCheck, ViewChild, ElementRef, Renderer} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, RouteParams} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {Playlist} from '../../business/model/playlist';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {PlayListItemUI} from '../../components/playlists/playlist-item';
import {PlayListMenuUI} from '../../components/playlists/playlist-menu';
import {PlayListPositionCopierUI} from '../../components/playlists/playlist-position-copier';


@Component({
    selector: 'etb-playlist',
    templateUrl: './components/playlists/playlist.html',
    directives: [ROUTER_DIRECTIVES, PlayListItemUI, PlayListMenuUI, PlayListPositionCopierUI],
    styleUrls: ['./components/playlists/playlist.css']
})
export class PlaylistUI implements OnInit, DoCheck {
    @ViewChild('inputPlaylistName') inputPlaylistName: ElementRef;
    @ViewChild('inputPlaylistBand') inputPlaylistBand: ElementRef;
    @ViewChild('inputPlaylistEvent') inputPlaylistEvent: ElementRef;
    playlist: Playlist;
    playlistPositionToBeCopied: PlaylistPosition;
    editModus: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router, routeParams: RouteParams, public renderer: Renderer) {
        this.playlist = this.tuneBookService.getPlaylist(parseInt(routeParams.get('id')));
    }

    ngOnInit() {
        this.sortPlaylistPosition();
        this.editModus = this.tuneBookService.isEditModus();
    }

    ngDoCheck() {
        this.sortPlaylistPosition();
        this.editModus = this.tuneBookService.isEditModus();
    }

    sortPlaylistPosition() {
        this.playlist.playlistPositions.sort(function(a: PlaylistPosition, b: PlaylistPosition) {
            return a.position - b.position;
        });
    }

    handleKeyDownOnPlaylistName(e:KeyboardEvent) {
        let keycode = (e.keyCode ? e.keyCode : e.which);

        if (keycode === 13) { // ENTER
            (<HTMLInputElement>e.target).blur();
            e.preventDefault();
            this.renderer.invokeElementMethod(this.inputPlaylistBand.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlaylistBand.nativeElement, 'select', []);
        }
    }

    handleBlurOnPlaylistName(e:FocusEvent) {
        this.playlist.name = (<HTMLInputElement>e.target).value;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPlaylistBand(e:KeyboardEvent) {
        let keycode = (e.keyCode ? e.keyCode : e.which);

        if (keycode === 13) { // ENTER
            (<HTMLInputElement>e.target).blur();
            e.preventDefault();
            this.renderer.invokeElementMethod(this.inputPlaylistEvent.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlaylistEvent.nativeElement, 'select', []);
        }
    }

    handleBlurOnPlaylistBand(e:FocusEvent) {
        this.playlist.band = (<HTMLInputElement>e.target).value;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPlaylistEvent(e:KeyboardEvent) {
        let keycode = (e.keyCode ? e.keyCode : e.which);

        if (keycode === 13) { // ENTER
            (<HTMLInputElement>e.target).blur();
            e.preventDefault();
            this.renderer.invokeElementMethod(this.inputPlaylistName.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlaylistName.nativeElement, 'select', []);
        }
    }

    handleBlurOnPlaylistEvent(e:FocusEvent) {
        this.playlist.event = (<HTMLInputElement>e.target).value;
        this.tuneBookService.storeTuneBookAbc();
    }
    
    setPlaylistPositionToBeCopied(e){
        this.playlistPositionToBeCopied = e;
    }

    copyPlaylist() {
        let newPlaylistId = this.tuneBookService.copyPlaylist(this.playlist.id);
        this.tuneBookService.storeTuneBookAbc();
        this.router.navigate(['/Playlist', { id: newPlaylistId }]);
    }

    deletePlaylist() {
        this.tuneBookService.deletePlaylist(this.playlist.id);
        this.tuneBookService.storeTuneBookAbc();
        this.router.navigate(['/PlaylistList']);
    }
}


