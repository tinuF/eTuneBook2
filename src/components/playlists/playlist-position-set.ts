import {Component, Input, OnInit, DoCheck, OnDestroy, ViewChild, ElementRef, Renderer} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {PlayListPositionSetPositionUI} from '../../components/playlists/playlist-position-set-position';

@Component({
    selector: 'etb-playlist-position-set',
    templateUrl: './components/playlists/playlist-position-set.html',
    directives: [ROUTER_DIRECTIVES, PlayListPositionSetPositionUI],
    styleUrls: ['./components/playlists/playlist-position-set.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListPositionSetUI implements OnInit, DoCheck, OnDestroy {
    @Input() playlistPosition: PlaylistPosition;
    @ViewChild('inputPlaylistPositionName') inputPlaylistPositionName: ElementRef;
    editModus: boolean;
    modusActionSubscription: Subscription;
    positions: Array<number>;

    constructor(public tuneBookService: TuneBookService, public router: Router, public renderer: Renderer) {

    }
    
    ngOnInit() {
        this.sortSetPosition();
        this.setPositions();
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("playlist-position-set:modusActionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngDoCheck() {
        this.setPositions();
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
        }
    }

    handleBlurOnPlaylistPositionName(focusEvent:FocusEvent) {
        this.tuneBookService.storeTuneBookAbc();
    }

    setPositions() {
        this.positions = this.tuneBookService.getPlaylistPositionsAsNumbers(this.playlistPosition.playlistId);
    }

    setPosition(e) {
        let oldPosition: number = this.playlistPosition.position;
        let newPosition: number = parseInt(e.target.value);

        if (oldPosition != newPosition) {
            this.tuneBookService.movePlaylistPosition(this.playlistPosition.playlistId, oldPosition, newPosition);
            this.tuneBookService.storeTuneBookAbc();
        }
    }

    deletePlaylistPosition(e) {
        this.tuneBookService.deletePlaylistPosition(this.playlistPosition.playlistId, this.playlistPosition.position);
        this.tuneBookService.storeTuneBookAbc();
    }
}


