import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import { TuneBookService, Playlist, PlaylistPosition, ACTION } from '../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist',
    templateUrl: 'playlist.component.html',
    styleUrls: ['playlist.component.css']
})
export class PlaylistComponent implements OnInit, OnDestroy {
    @ViewChild('inputPlaylistName') inputPlaylistName: ElementRef;
    @ViewChild('inputPlaylistBand') inputPlaylistBand: ElementRef;
    @ViewChild('inputPlaylistEvent') inputPlaylistEvent: ElementRef;
    playlist: Playlist;
    playlistPositionToBeCopied: PlaylistPosition;
    editModus: boolean;
    modusActionSubscription: Subscription;
    routerSubscription: Subscription;
    confirmDeletePlaylist: boolean;

    constructor(public tuneBookService: TuneBookService, public router: Router, public route: ActivatedRoute, public renderer: Renderer) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.confirmDeletePlaylist = false;
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('playlist:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });

        this.routerSubscription = this.route
            .params
            .subscribe(params => {
                let id = +params['id'];
                this.playlist = this.tuneBookService.getPlaylist(id);
                this.sortPlaylistPosition();
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
        this.routerSubscription.unsubscribe();
    }

    sortPlaylistPosition() {
        this.playlist.playlistPositions.sort(function (a: PlaylistPosition, b: PlaylistPosition) {
            return a.position - b.position;
        });
    }

    handleKeyDownOnPlaylistName(keyboardEvent: KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            //(<HTMLInputElement>keyboardEvent.target).blur();
            //keyboardEvent.preventDefault();
            this.renderer.invokeElementMethod(this.inputPlaylistName.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPlaylistBand.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlaylistBand.nativeElement, 'select', []);
        }
    }

    handleBlurOnPlaylistName(focusEvent: FocusEvent) {
        //this.playlist.name = this.inputPlaylistName.nativeElement.value;
        //this.playlist.name = (<HTMLInputElement>focusEvent.target).value;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPlaylistBand(keyboardEvent: KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputPlaylistBand.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPlaylistEvent.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlaylistEvent.nativeElement, 'select', []);
        }
    }

    handleBlurOnPlaylistBand(focusEvent: FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPlaylistEvent(keyboardEvent: KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputPlaylistEvent.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPlaylistName.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlaylistName.nativeElement, 'select', []);
        }
    }

    handleBlurOnPlaylistEvent(focusEvent: FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }

    setPlaylistPositionToBeCopied(playlistPosition: PlaylistPosition) {
        this.playlistPositionToBeCopied = playlistPosition;
    }

    copyPlaylist() {
        let newPlaylistId = this.tuneBookService.copyPlaylist(this.playlist.id);
        this.router.navigate(['/playlist', newPlaylistId ]);
    }

    deletePlaylist() {
        this.tuneBookService.deletePlaylist(this.playlist.id);
        this.router.navigate(['/playlists']);
    }
}


