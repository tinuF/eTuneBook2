import {Component, OnInit, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {Subscription}   from 'rxjs/Subscription';

import {TuneBookService} from '../../services/tunebook-service';
import {ACTION} from '../../common/action';
import {TuneSet} from '../../business/model/tuneset';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/common/sample-dots';
import {SetPositionUI} from '../../components/sets/set-position';
import {SetPlaylistListUI} from '../../components/sets/set-playlist-list';
import {FilterSettings} from '../../common/settings/filter-settings';


@Component({
    selector: 'etb-set-list-item',
    templateUrl: './components/sets/set-list-item.html',
    directives: [ROUTER_DIRECTIVES, SampleDotsUI, SetPositionUI, SetPlaylistListUI],
    styleUrls: ['./components/sets/set-list-item.css'],
    pipes: [EliminateThe, FromNow]
})
export class SetListItemUI implements OnInit {
    @Input() set: TuneSet;
    @Input() showFilterCheckbox: boolean;
    filterSettings: FilterSettings;
    editModus: boolean;
    modusActionSubscription: Subscription;

    constructor(public tuneBookService: TuneBookService, public router: Router) {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
    }

    ngOnInit() {
        this.sortSetPosition();
        this.editModus = this.tuneBookService.isEditModus();
        this.modusActionSubscription = this.tuneBookService.modusActionObservable.subscribe(
            (action) => {
                console.log("set-list-item:modusActionSubscription called: " + action);
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
        this.set.tuneSetPositions.sort(function(a: TuneSetPosition, b: TuneSetPosition) {
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


