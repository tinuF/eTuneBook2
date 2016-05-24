import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import { TuneBookService, TuneSetPositionPlayInfo, ACTION } from '../../../business/index';
import { TunePlayedComponent } from '../../../shared/tune/index';
import { EliminateThePipe } from '../../../shared/pipes/index';

@Component({
    moduleId: module.id,
    selector: 'etb-playlist-item-set-position',
    templateUrl: 'playlist-item-set-position.component.html',
    directives: [ROUTER_DIRECTIVES, TunePlayedComponent],
    styleUrls: ['playlist-item-set-position.component.css'],
    pipes: [EliminateThePipe]
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


