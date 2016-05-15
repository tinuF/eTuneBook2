import {Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Renderer} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {PlayListPositionSetPositionUI} from '../../components/playlist-position/playlist-position-set-position';

@Component({
    selector: 'etb-playlist-position-set',
    templateUrl: './components/playlist-position/playlist-position-set.html',
    directives: [ROUTER_DIRECTIVES, PlayListPositionSetPositionUI],
    styleUrls: ['./components/playlist-position/playlist-position-set.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListPositionSetUI implements OnInit, OnDestroy {
    @Input() playlistPosition: PlaylistPosition;
    @ViewChild('inputPlaylistPositionName') inputPlaylistPositionName: ElementRef;
    @ViewChild('inputPlaylistPositionAnnotation') inputPlaylistPositionAnnotation: ElementRef;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router, public renderer: Renderer) {

    }
    
    ngOnInit() {
        this.sortSetPosition();
        this.editModus = this.tuneBookService.isEditModus();
        
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("playlist-position-set:modusActionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }
    
    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    sortSetPosition() {
        this.playlistPosition.tuneSetPositionPlayInfos.sort(function(a: TuneSetPositionPlayInfo, b: TuneSetPositionPlayInfo) {
            return a.tuneSetPosition.position - b.tuneSetPosition.position;
        });
    }

    handleKeyDownOnPlaylistPositionName(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputPlaylistPositionName.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPlaylistPositionAnnotation.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlaylistPositionAnnotation.nativeElement, 'select', []);
        }
    }

    handleBlurOnPlaylistPositionName(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }
    
    handleKeyDownOnPlaylistPositionAnnotation(keyboardEvent:KeyboardEvent) {
        let keycode = (keyboardEvent.keyCode ? keyboardEvent.keyCode : keyboardEvent.which);

        if (keycode === 13) { // ENTER
            this.renderer.invokeElementMethod(this.inputPlaylistPositionAnnotation.nativeElement, 'blur', []);
            this.renderer.invokeElementMethod(this.inputPlaylistPositionName.nativeElement, 'focus', []);
            this.renderer.invokeElementMethod(this.inputPlaylistPositionName.nativeElement, 'select', []);
        }
    }

    handleBlurOnPlaylistPositionAnnotation(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }

    deletePlaylistPosition() {
        let playlistId = this.playlistPosition.playlistId;
        this.tuneBookService.deletePlaylistPosition(this.playlistPosition.playlistId, this.playlistPosition.position);
        this.router.navigate(['/Playlist', { id: playlistId }]);
    }
}


