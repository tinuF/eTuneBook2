import {Component, Input, Output, OnInit, DoCheck, EventEmitter} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {TuneSetPositionPlayInfo} from '../../business/model/tunesetposition-playinfo';
import {Playlist} from '../../business/model/playlist';
import {PlaylistPosition} from '../../business/model/playlistposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {PlayListItemSetPositionUI} from '../../components/playlists/playlist-item-set-position';



@Component({
    selector: 'etb-playlist-item',
    templateUrl: './components/playlists/playlist-item.html',
    directives: [ROUTER_DIRECTIVES, PlayListItemSetPositionUI],
    styleUrls: ['./components/playlists/playlist-item.css'],
    pipes: [EliminateThe, FromNow]
})
export class PlayListItemUI implements OnInit, DoCheck {
    @Input() playlistPosition: PlaylistPosition;
    @Output() copyPlaylistPosition: EventEmitter<PlaylistPosition> = new EventEmitter();
    editModus: boolean;
    actionSubscription: Subscription;
    positions: Array<number>;
    playlists: Array<Playlist>;
    selectedPlaylistId: number;

    constructor(public tuneBookService: TuneBookService, public router: Router) {

    }

    ngOnInit() {
        this.sortSetPosition();
        this.setPositions();
        this.editModus = this.tuneBookService.isEditModus();
        this.playlists = this.tuneBookService.getPlaylists();
        
        this.actionSubscription = this.tuneBookService.actionObservable.subscribe(
            (action) => {
                console.log("playlist-item:actionSubscription called: " + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngDoCheck() {
        this.setPositions();
    }
    
    ngOnDestroy() {
        this.actionSubscription.unsubscribe();
    }

    sortSetPosition() {
        this.playlistPosition.tuneSetPositionPlayInfos.sort(function(a: TuneSetPositionPlayInfo, b: TuneSetPositionPlayInfo) {
            return a.tuneSetPosition.position - b.tuneSetPosition.position;
        });
    }

    handleKeyDownOnPlaylistPositionName(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) { // ENTER
            event.target.blur();
            event.preventDefault();
            this.handleBlurOnPlaylistPositionName(event);
        }
    }

    handleBlurOnPlaylistPositionName(focusEvent:FocusEvent) {
        this.playlistPosition.name = (<HTMLInputElement>focusEvent.target).value;
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

    setSelectedPlaylistId(e) {
        this.selectedPlaylistId = e.target.value;
    }
    
    sendPlaylistPositionToCopier() {
        this.copyPlaylistPosition.next(this.playlistPosition);        
    }


    deletePlaylistPosition(e) {
        this.tuneBookService.deletePlaylistPosition(this.playlistPosition.playlistId, this.playlistPosition.position);
        this.tuneBookService.storeTuneBookAbc();
    }

    justPlayedTheSet() {
        var now = new Date();
        this.tuneBookService.addTuneSetPlayDate(this.playlistPosition.tuneSet, now);
        this.tuneBookService.storeTuneBookAbc();
    }
}


