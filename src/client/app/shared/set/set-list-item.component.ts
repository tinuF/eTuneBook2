import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { TuneBookService, TuneSet, TuneSetPosition, ACTION, FilterSettings } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-set-list-item',
    templateUrl: 'set-list-item.component.html',
    styleUrls: ['set-list-item.component.css']
})
export class SetListItemComponent implements OnInit, OnDestroy {
    @Input() set: TuneSet;
    @Input() showFilterCheckbox: boolean;
    @Input() showNavigationToSetListButton: boolean;
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

    toggleSetSelection(e:Event) {
        if ((<any>e.target).checked) {
            this.filterSettings.addSetId(this.set.id);
        } else {
            this.filterSettings.removeSetId(this.set.id);
        }
    }
}


