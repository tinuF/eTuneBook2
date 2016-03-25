import {Component} from 'angular2/core';

import {TuneBookService} from '../../services/tunebook-service';
import {FilterSettings} from '../../common/settings/filter-settings';

@Component({
    selector: 'etb-filter-text',
    templateUrl: './components/app/filter-text.html',
    styleUrls: ['./components/app/filter-text.css'] 
})
export class FilterTextUI {
    filterSettings: FilterSettings;

    constructor(public tuneBookService: TuneBookService) {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
    }

}
