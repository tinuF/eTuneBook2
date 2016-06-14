import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, TuneSet, TuneSetPosition, ACTION, FilterSettings } from '../../business/index';
import { SampleDotsComponent } from '../dots/sample-dots.component';
import { SetPositionComponent } from './position/set-position.component';
import { SetPlaylistListComponent } from './playlist-list/set-playlist-list.component';

@Component({
    moduleId: module.id,
    selector: 'etb-set-list-item',
    templateUrl: 'set-list-item.component.html',
    directives: [SampleDotsComponent, SetPositionComponent, SetPlaylistListComponent],
    styleUrls: ['set-list-item.component.css']
})
export class SetListItemComponent implements OnInit, OnDestroy {
    @Input() set: TuneSet;
    @Input() showFilterCheckbox: boolean;
    filterSettings: FilterSettings;
    editModus: boolean;
    modusActionSubscription: Subscription;
    selected: boolean;

    constructor(public tuneBookService: TuneBookService) {

    }

    ngOnInit() {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
        this.selected = false;

        if (this.filterSettings.setIds.indexOf(this.set.id) > -1) {
            this.selected = true;
        }

        this.sortSetPosition();

        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                //console.log('set-list-item:modusActionSubscription called: ' + action);
                if (action === ACTION.TOGGLE_EDIT_MODUS) {
                    this.editModus = this.tuneBookService.isEditModus();
                }
            });
    }

    ngOnDestroy() {
        this.modusActionSubscription.unsubscribe();
    }

    justPlayedTheSet() {
        var now = new Date();
        this.tuneBookService.addTuneSetPlayDate(this.set, now);
        this.tuneBookService.storeTuneBookAbc();
    }

    sortSetPosition() {
        this.set.tuneSetPositions.sort(function (a: TuneSetPosition, b: TuneSetPosition) {
            return a.position - b.position;
        });
    }

    toggleSetSelection(e) {
        if (e.target.checked) {
            this.filterSettings.addSetId(this.set.id);
        } else {
            this.filterSettings.removeSetId(this.set.id);
        }
    }
}


