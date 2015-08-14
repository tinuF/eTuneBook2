/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';

import {TuneBookService} from '../../services/tunebook-service';
import {FilterSettings} from '../../common/settings/filter';

@Component({
    selector: 'filter-text' 
})
@View({
    templateUrl: './components/filter-text/filter-text.html?v=<%= VERSION %>'
})
export class FilterText {
    filterSettings: FilterSettings;

    constructor(public tuneBookService: TuneBookService) {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
    }

}



    






