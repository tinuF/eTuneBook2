import { Component, OnInit } from '@angular/core';

import { TuneBookService, TuneBook, getSystemProperties, FilterSettings } from '../business/index';

@Component({
    moduleId: module.id,
    selector: 'etb-filter', //ACHTUNG: filter kollidiert mit svg filter element, deshalb ist etbk- wichtig!
    templateUrl: 'filter.component.html',
    styleUrls: ['filter.component.css']
})
export class FilterComponent implements OnInit {
    tuneBook: TuneBook;
    filterSettings: FilterSettings;
    systemProperties: any;
    currentFilter: string;
    filterActive: boolean;
    type: string;
    types: string[];
    key: string;
    keys: string[];
    event: string;
    events: string[];
    band: string;
    bands: string[];
    color: string;
    colors: string[];

    constructor(public tuneBookService: TuneBookService) {
        this.systemProperties = getSystemProperties();
        this.tuneBook = this.tuneBookService.getCurrentTuneBook();
        this.filterSettings = this.tuneBookService.getCurrentFilterSettings();
    }

    ngOnInit() {
        this.setFilterOptions();
        this.setSelectedType(this.filterSettings.type);
        this.setSelectedKey(this.filterSettings.key);
        this.setSelectedColor(this.filterSettings.color);
        this.setSelectedEvent(this.filterSettings.event);
        this.setSelectedBand(this.filterSettings.band);
    }

    setSelectedType(type: string) {
        for (var i = 0; i < this.types.length; i++) {
            if (this.types[i] === type) {
                // Setzen neuer Filter
                this.type = this.types[i];
            }
        }
    }

    setSelectedKey(key: string) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i] === key) {
                // Setzen neuer Filter
                this.key = this.keys[i];
            }
        }
    }

    setSelectedEvent(event: string) {
        for (var i = 0; i < this.events.length; i++) {
            if (this.events[i] === event) {
                // Setzen neuer Filter
                this.event = this.events[i];
            }
        }
    }

    setSelectedBand(band: string) {
        for (var i = 0; i < this.bands.length; i++) {
            if (this.bands[i] === band) {
                // Setzen neuer Filter
                this.band = this.bands[i];
            }
        }
    }

    setSelectedColor(color: string) {
        for (var i = 0; i < this.colors.length; i++) {
            if (this.colors[i] === color) {
                // Setzen neuer Filter
                this.color = this.colors[i];
            }
        }
    }

    setTypes() {
        this.types = this.tuneBook.getTuneTypes();
    }

    setKeys() {
        this.keys = this.tuneBook.getKeys();
    }

    setEvents() {
        this.events = this.tuneBook.getEvents();
    }

    setBands() {
        this.bands = this.tuneBook.getBands();
    }

    setColors() {
        this.colors = this.tuneBook.getColors();
    }

    setFilterOptions() {
        this.setTypes();
        this.setKeys();
        this.setColors();
        this.setEvents();
        this.setBands();
    }

    setType(e: Event) {
        this.type = (<any>e.target).value;
        this.filterSettings.setType(this.type);
        this.applyFilter();
    }

    setKey(e: Event) {
        this.key = (<any>e.target).value;
        this.filterSettings.setKey(this.key);
        this.applyFilter();
    }

    setColor(e: Event) {
        this.color = (<any>e.target).value;
        //e.target.style.background = this.color;
        this.filterSettings.setColor(this.color);
        this.applyFilter();
    }

    setEvent(e: Event) {
        this.event = (<any>e.target).value;
        this.filterSettings.setEvent(this.event);
        this.applyFilter();
    }

    setBand(e: Event) {
        this.band = (<any>e.target).value;
        this.filterSettings.setBand(this.band);
        this.applyFilter();
    }

    applyFilter() {
        this.tuneBookService.applyFilter();
    }
}
