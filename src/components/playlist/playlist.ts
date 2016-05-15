import {Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, RouteParams} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {Playlist} from '../../business/model/playlist';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {PlayListItemUI} from '../../components/playlist/playlist-item';
import {PlayListMenuUI} from '../../components/playlist/playlist-menu';
import {PlayListPositionCopierUI} from '../../components/common/playlist/playlist-position-copier';


@Component({
    selector: 'etb-playlist',
    templateUrl: './components/playlist/playlist.html',
    directives: [ROUTER_DIRECTIVES, PlayListItemUI, PlayListMenuUI, PlayListPositionCopierUI],
    styleUrls: ['./components/playlist/playlist.css']
})
export class PlaylistUI implements OnInit, OnDestroy {
    @ViewChild('inputPlaylistName') inputPlaylistName: ElementRef;
    @ViewChild('inputPlaylistBand') inputPlaylistBand: ElementRef;
    @ViewChild('inputPlaylistEvent') inputPlaylistEvent: ElementRef;
    playlist: Playlist;
    playlistPositionToBeCopied: PlaylistPosition;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router, routeParams: RouteParams, public renderer: Renderer) {
        this.playlist = this.tuneBookService.getPlaylist(parseInt(routeParams.get('id')));
    }

    ngOnInit() {
        this.sortPlaylistPosition();
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("playlist:modusActionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }
    
    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    sortPlaylistPosition() {
        this.playlist.playlistPositions.sort(function(a: PlaylistPosition, b: PlaylistPosition) {
            return a.position - b.position;
        });
    }

    handleKeyDownOnPlaylistName(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            //(<HTMLInputElement>keyboardEvent.target).blur();
            //keyboardEvent.preventDefault();
            this.renderer.invokeElementMethod(this.inputPlaylistName.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPlaylistBand.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlaylistBand.nativeElement, 'select', []);
        }
    }

    handleBlurOnPlaylistName(focusEvent:FocusEvent) {
        //this.playlist.name = this.inputPlaylistName.nativeElement.value;
        //this.playlist.name = (<HTMLInputElement>focusEvent.target).value;
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPlaylistBand(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputPlaylistBand.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPlaylistEvent.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlaylistEvent.nativeElement, 'select', []);
        }
    }

    handleBlurOnPlaylistBand(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }

    handleKeyDownOnPlaylistEvent(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputPlaylistEvent.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPlaylistName.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlaylistName.nativeElement, 'select', []);
        }
    }

    handleBlurOnPlaylistEvent(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }
    
    setPlaylistPositionToBeCopied(playlistPosition:PlaylistPosition){
        this.playlistPositionToBeCopied = playlistPosition;
    }

    copyPlaylist() {
        let newPlaylistId = this.tuneBookService.copyPlaylist(this.playlist.id);
        this.router.navigate(['/Playlist', { id: newPlaylistId }]);
    }

    deletePlaylist() {
        this.tuneBookService.deletePlaylist(this.playlist.id);
        this.router.navigate(['/PlaylistList']);
    }
}


