import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, Renderer } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';

import { TuneBookService, TuneSetPositionPlayInfo, PlaylistPosition, ACTION } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-item',
    templateUrl: 'playlist-item.component.html',
    styleUrls: ['playlist-item.component.css']
})
export class PlayListItemComponent implements OnInit, OnDestroy {
    @Input() playlistPosition: PlaylistPosition;
    @Output() copyPlaylistPosition: EventEmitter<any> = new EventEmitter();
    @ViewChild('inputPlaylistPositionName') inputPlaylistPositionName: ElementRef;
    editModus: boolean;
    modusActionSubscription: Subscription;
    modelActionSubscription: Subscription;
    positions: Array<number>;
    confirmDeletePlaylistPosition: boolean;

    constructor(public tuneBookService: TuneBookService, public renderer: Renderer) {

    }

    ngOnInit() {
        this.sortSetPosition();
        this.setPositions();
        this.editModus = this.tuneBookService.isEditModus();
        this.confirmDeletePlaylistPosition = false;

        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('playlist-item:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });

        this.modelActionSubscription = this.tuneBookService.modelActionObservable.subscribe(
            (action) => {
                //console.log('playlist-item:modelActionSubscription called: ' + action);
                if (action === ACTION.DELETE_PLAYLISTPOSITION) {
                    this.setPositions();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
        this.modelActionSubscription.unsubscribe();
    }

    sortSetPosition() {
        this.playlistPosition.tuneSetPositionPlayInfos.sort(function (a: TuneSetPositionPlayInfo, b: TuneSetPositionPlayInfo) {
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

    setPosition(event: Event) {
        let oldPosition: number = this.playlistPosition.position;
        let newPosition: number = parseInt((<any>event.target).value);

        if (oldPosition !== newPosition) {
            this.tuneBookService.movePlaylistPosition(this.playlistPosition.playlistId, oldPosition, newPosition);
            this.tuneBookService.storeTuneBookAbc();
        }
    }

    sendPlaylistPositionToCopier() {
        this.copyPlaylistPosition.next(this.playlistPosition);
    }

    deletePlaylistPosition() {
        this.tuneBookService.deletePlaylistPosition(this.playlistPosition.playlistId, this.playlistPosition.position);
    }

    justPlayedTheSet() {
        var now = new Date();
        this.tuneBookService.addTuneSetPlayDate(this.playlistPosition.tuneSet, now);
        this.tuneBookService.storeTuneBookAbc();
    }
}


