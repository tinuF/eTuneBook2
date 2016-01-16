import {Component} from 'angular2/core';

import {TuneBookService} from '../../services/tunebook-service';
import {FilterSettings} from '../../common/settings/filter-settings';

@Component({
    selector: 'filter-text',
    templateUrl: './components/filter-text/filter-text.html',
    styleUrls: ['./components/filter-text/filter-text.css'] 
})
export class FilterTextUI {
    filterSettings: FilterSettings;

    constructor(public tuneBookService: TuneBookService) {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
    }

}



    






