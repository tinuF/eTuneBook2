import {Component, ElementRef, OnInit, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {TuneBookService} from '../../services/tunebook-service';
import {TuneSet} from '../../business/model/tuneset';
import {TuneSetPosition} from '../../business/model/tunesetposition';
import {EliminateThe} from '../../pipes/eliminate-the';
import {FromNow} from '../../pipes/from-now';
import {SampleDotsUI} from '../../components/sample-dots/sample-dots';
import {SetPositionUI} from '../../components/set-position/set-position';
import {SetPlaylistListUI} from '../../components/set-play-list-list/set-play-list-list';
import {FilterSettings} from '../../common/settings/filter-settings';


@Component({
    selector: 'etb-set-list-item',
    inputs: ['set'],
    templateUrl: './components/set-list-item/set-list-item.html',
    directives: [ROUTER_DIRECTIVES, SampleDotsUI, SetPositionUI, SetPlaylistListUI],
    styleUrls: ['./components/set-list-item/set-list-item.css'],
    pipes: [EliminateThe, FromNow]
})
export class SetListItemUI implements OnInit {
    @Input() set: TuneSet;
    @Input() showFilterCheckbox: boolean;
    filterSettings: FilterSettings;

    constructor(public tuneBookService: TuneBookService, public router: Router, public elementRef: ElementRef) {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
    }

    ngOnInit() {
        //needs jQuery UI
        //jQuery(this.elementRef.nativeElement).draggable({containment:'#draggable-parent'});
        this.sortSetPosition();
    }

    justPlayedTheSet() {
        var now = new Date();
        this.tuneBookService.addTuneSetPlayDate(this.set, now);
        this.tuneBookService.storeTuneBookAbc();
    }

    sortSetPosition() {
        this.set.tuneSetPositions.sort(function(a: TuneSetPosition, b: TuneSetPosition) {
            return a.position - b.position
        })
    }

    toggleSetSelection(e) {
        if (e.target.checked) {
            this.filterSettings.addSetId(this.set.tuneSetId);
        } else {
            this.filterSettings.removeSetId(this.set.tuneSetId);
        }
    }
}


