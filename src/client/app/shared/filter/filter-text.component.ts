import { Component } from '@angular/core';

import { TuneBookService, FilterSettings } from '../../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-filter-text',
    templateUrl: 'filter-text.component.html',
    styleUrls: ['filter-text.component.css']
})
export class FilterTextComponent {
    filterSettings: FilterSettings;

    constructor(public tuneBookService: TuneBookService) {
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
    }

}
