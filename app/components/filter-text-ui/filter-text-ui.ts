/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';

import {TuneBookService} from '../../services/tunebook-service';
import {FilterSettings} from '../../common/settings/filter-settings';

@Component({
    selector: 'filter-text' 
})
@View({
    templateUrl: './components/filter-text-ui/filter-text-ui.html',
    styleUrls: ['./components/filter-text-ui/filter-text-ui.css']
})
export class FilterTextUI {
    filterSettings: FilterSettings;

    constructor(public tuneBookService: TuneBookService) {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
    }

}



    






