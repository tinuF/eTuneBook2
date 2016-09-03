import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';

import { TuneBookService, TuneSetPositionPlayInfo, ACTION } from '../../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-item-set-position',
    templateUrl: 'playlist-item-set-position.component.html',
    styleUrls: ['playlist-item-set-position.component.css']
})
export class PlayListItemSetPositionComponent implements OnInit, OnDestroy {
    @Input() tuneSetPositionPlayInfo: TuneSetPositionPlayInfo;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('playlist-item-set-position:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }
}


