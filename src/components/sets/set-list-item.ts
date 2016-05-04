import {Component, OnInit, DoCheck, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
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
export class SetListItemUI implements OnInit, DoCheck {
    @Input() set: TuneSet;
    @Input() showFilterCheckbox: boolean;
    filterSettings: FilterSettings;
    editModus: boolean;
    editModusSubscription: any;

    constructor(public tuneBookService: TuneBookService, public router: Router) {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
    }

    ngOnInit() {
        this.sortSetPosition();
        this.editModusSubscription = this.tuneBookService.editModusChange$.subscribe(
            editModus => this.editModus = editModus);
    }

    ngDoCheck() {
        this.sortSetPosition();
    }
    
    ngOnDestroy() {
        this.editModusSubscription.unsubscribe();
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


